#!/usr/bin/env node
/*
Usage:
  node scripts/generate-responsive.mjs <srcDir> <outDir> [--widths=600,900,1440,2048] [--quality=82]

Example:
  node scripts/generate-responsive.mjs public/image public/images --widths=600,900,1440,2048 --quality=82

Generates resized variants at outDir/<width>/<relative_path> preserving directory structure.
Skips files if the output is newer than the input.
*/
import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

const exts = new Set(['.jpg', '.jpeg', '.png', '.webp'])

function parseListArg(key, def) {
  const arg = process.argv.find((a) => a.startsWith(`--${key}=`))
  if (!arg) return def
  const v = arg.split('=')[1]
  if (!v) return def
  return v.split(',').map((x) => Number(x.trim())).filter((n) => Number.isFinite(n) && n > 0)
}

function parseNumArg(key, def) {
  const arg = process.argv.find((a) => a.startsWith(`--${key}=`))
  if (!arg) return def
  const v = Number(arg.split('=')[1])
  return Number.isFinite(v) ? v : def
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
    console.error('Usage: node scripts/generate-responsive.mjs <srcDir> <outDir> [--widths=600,900,1440,2048] [--quality=82]')
    process.exit(1)
  }
  const cwd = process.cwd()
  const srcDir = path.resolve(cwd, srcDirArg)
  const outDir = path.resolve(cwd, outDirArg)
  const widths = parseListArg('widths', [600, 900, 1440, 2048])
  const quality = parseNumArg('quality', 82)

  let total = 0, skipped = 0, written = 0
  for await (const file of walk(srcDir)) {
    const ext = path.extname(file).toLowerCase()
    if (!exts.has(ext)) continue
    total++
    const rel = path.relative(srcDir, file)
    const inStat = await fs.stat(file)

    for (const w of widths) {
      const outPath = path.join(outDir, String(w), rel)
      await ensureDir(path.dirname(outPath))

      const outOk = await exists(outPath)
      if (outOk) {
        const outStat = await fs.stat(outPath)
        if (outStat.mtimeMs >= inStat.mtimeMs) {
          skipped++
          continue
        }
      }

      const pipeline = sharp(file, { failOn: 'warning' })
        .rotate()
        .resize({ width: w, withoutEnlargement: true, fit: 'inside' })

      let outBuf
      if (ext === '.png') {
        outBuf = await pipeline.png({ quality }).toBuffer()
      } else if (ext === '.webp') {
        outBuf = await pipeline.webp({ quality }).toBuffer()
      } else {
        outBuf = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer()
      }
      await fs.writeFile(outPath, outBuf)
      written++
      process.stdout.write('.')
    }
  }

  console.log(`\nProcessed ${total} source files → written ${written}, skipped ${skipped}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


