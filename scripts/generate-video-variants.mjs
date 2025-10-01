#!/usr/bin/env node
/*
Usage:
  node scripts/generate-video-variants.mjs <srcFile> <outDir> [--heights=480,720,1080]

Example:
  node scripts/generate-video-variants.mjs public/video/intro.mp4 public/video/variants --heights=480,720,1080

Generates H.264 MP4 variants with faststart for quick playback.
Skips work if outputs are newer than the input.
*/
import fs from 'fs/promises'
import path from 'path'
import ffmpegPath from 'ffmpeg-static'
import ffmpeg from 'fluent-ffmpeg'

ffmpeg.setFfmpegPath(ffmpegPath)

function parseHeights() {
  const arg = process.argv.find((a) => a.startsWith('--heights='))
  if (!arg) return [480, 720, 1080]
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
    const command = ffmpeg(src)
      .videoCodec('libx264')
      .audioCodec('aac')
      .audioBitrate('128k')
      .size(`?x${height}`)
      .outputOptions([
        '-movflags +faststart',
        '-preset veryfast',
        '-profile:v high',
        '-pix_fmt yuv420p',
        // target bitrates by height
        ...(height <= 480
          ? ['-b:v 1000k', '-maxrate 1200k', '-bufsize 2000k']
          : height <= 720
          ? ['-b:v 2500k', '-maxrate 3000k', '-bufsize 6000k']
          : ['-b:v 4500k', '-maxrate 5200k', '-bufsize 9000k']),
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
    console.error('Usage: node scripts/generate-video-variants.mjs <srcFile> <outDir> [--heights=480,720,1080]')
    process.exit(1)
  }
  const cwd = process.cwd()
  const srcFile = path.resolve(cwd, srcFileArg)
  const outDir = path.resolve(cwd, outDirArg)
  const heights = parseHeights()

  const srcStat = await fs.stat(srcFile)
  const base = path.basename(srcFile, path.extname(srcFile))

  for (const h of heights) {
    const outPath = path.join(outDir, `${base}-${h}.mp4`)
    const outOk = await exists(outPath)
    if (outOk) {
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


