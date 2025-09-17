#!/usr/bin/env node
/*
 Usage:
   node scripts/generate-thumbs.mjs <srcDir> <outDir> [--width=900] [--quality=80]

 Example:
   node scripts/generate-thumbs.mjs public/image public/thumb --width=900 --quality=80

 Creates smaller thumbnails keeping directory structure. Only new/changed files are processed.
*/
import fs from 'fs/promises'
import path from 'path'
import url from 'url'
import sharp from 'sharp'

const exts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif'])

function parseArg(key, def) {
  const arg = process.argv.find((a) => a.startsWith(`--${key}=`))
  if (!arg) return def
  const v = arg.split('=')[1]
  const n = Number(v)
  return Number.isFinite(n) ? n : def
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      yield* walk(p)
    } else {
      yield p
    }
  }
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true })
}

async function exists(p) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

async function main() {
  const [,, srcDirArg, outDirArg] = process.argv
  if (!srcDirArg || !outDirArg) {
    console.error('Usage: node scripts/generate-thumbs.mjs <srcDir> <outDir> [--width=900] [--quality=80]')
    process.exit(1)
  }
  const cwd = process.cwd()
  const srcDir = path.resolve(cwd, srcDirArg)
  const outDir = path.resolve(cwd, outDirArg)
  const width = parseArg('width', 900)
  const quality = parseArg('quality', 80)

  let total = 0, skipped = 0, written = 0
  for await (const file of walk(srcDir)) {
    const ext = path.extname(file).toLowerCase()
    if (!exts.has(ext)) continue
    total++
    const rel = path.relative(srcDir, file)
    const outPath = path.join(outDir, rel)
    await ensureDir(path.dirname(outPath))

    // Skip if output is newer
    const [inStat, outStat] = await Promise.all([
      fs.stat(file),
      exists(outPath).then((ok) => ok ? fs.stat(outPath) : null)
    ])
    if (outStat && outStat.mtimeMs >= inStat.mtimeMs) {
      skipped++
      continue
    }

    const pipeline = sharp(file, { failOn: 'warning' })
      .rotate()
      .resize({ width, withoutEnlargement: true, fit: 'inside' })

    let outBuf
    if (ext === '.png') {
      outBuf = await pipeline.png({ quality }).toBuffer()
    } else if (ext === '.webp') {
      outBuf = await pipeline.webp({ quality }).toBuffer()
    } else if (ext === '.gif') {
      // convert gif to webp thumbnail for size
      const target = outPath.replace(/\.gif$/i, '.webp')
      outBuf = await pipeline.webp({ quality }).toBuffer()
      await fs.writeFile(target, outBuf)
      written++
      continue
    } else {
      outBuf = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer()
    }
    await fs.writeFile(outPath, outBuf)
    written++
    process.stdout.write('.')
  }

  console.log(`\nProcessed ${total} files → written ${written}, skipped ${skipped}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


