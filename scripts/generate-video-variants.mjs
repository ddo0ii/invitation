#!/usr/bin/env node
/*
Usage:
  node scripts/generate-video-variants.mjs <srcFile> <outDir> [--heights=360,480,720] [--force]

Example:
  node scripts/generate-video-variants.mjs public/video/intro.mp4 public/video/variants --heights=360,480,720 --force

Generates H.264 MP4 variants with faststart for quick playback.
Skips work if outputs are newer than the input (unless --force).
*/
import fs from 'fs/promises'
import path from 'path'
import ffmpegPath from 'ffmpeg-static'
import ffmpeg from 'fluent-ffmpeg'

ffmpeg.setFfmpegPath(ffmpegPath)

function parseHeights() {
  const arg = process.argv.find((a) => a.startsWith('--heights='))
  if (!arg) return [240, 360, 480, 720]
  return arg
    .split('=')[1]
    .split(',')
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n) && n > 0)
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

async function transcodeVariant(src, out, height) {
  await ensureDir(path.dirname(out))
  return new Promise((resolve, reject) => {
    // 더 높은 화질을 위해 CRF 하향(작은 값이 고화질). 1080p 고려 포함
    const crf = height <= 240 ? 31 : height <= 360 ? 29 : height <= 480 ? 27 : height <= 720 ? 25 : 24
    ffmpeg(src)
      .videoCodec('libx264')
      .noAudio()
      .fps(24)
      .size(`?x${height}`)
      .outputOptions([
        '-movflags +faststart',
        '-preset slow',
        '-profile:v main',
        '-pix_fmt yuv420p',
        `-crf ${crf}`,
        '-tune film',
        '-g 48',
        '-sc_threshold 0',
      ])
      .on('end', resolve)
      .on('error', reject)
      .save(out)
  })
}

async function main() {
  const [,, srcFileArg, outDirArg] = process.argv
  if (!srcFileArg || !outDirArg) {
    console.error('Usage: node scripts/generate-video-variants.mjs <srcFile> <outDir> [--heights=360,480,720] [--force]')
    process.exit(1)
  }
  const cwd = process.cwd()
  const srcFile = path.resolve(cwd, srcFileArg)
  const outDir = path.resolve(cwd, outDirArg)
  const heights = parseHeights()
  const force = process.argv.includes('--force')

  const srcStat = await fs.stat(srcFile)
  const base = path.basename(srcFile, path.extname(srcFile))

  for (const h of heights) {
    const outPath = path.join(outDir, `${base}-${h}.mp4`)
    const outOk = await exists(outPath)
    if (outOk && !force) {
      const outStat = await fs.stat(outPath)
      if (outStat.mtimeMs >= srcStat.mtimeMs) {
        // up-to-date
        continue
      }
    }
    process.stdout.write(`Generating ${path.relative(cwd, outPath)}...\n`)
    await transcodeVariant(srcFile, outPath, h)
  }

  console.log('Done generating video variants.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


