#!/usr/bin/env node
/*
Usage:
  node scripts/generate-video-poster.mjs <srcFile> <outFile> [--seek=0.5]

Generates a JPG poster image from the video at given time.
*/
import fs from 'fs/promises'
import path from 'path'
import ffmpegPath from 'ffmpeg-static'
import ffmpeg from 'fluent-ffmpeg'

ffmpeg.setFfmpegPath(ffmpegPath)

function parseSeek() {
  const arg = process.argv.find((a) => a.startsWith('--seek='))
  if (!arg) return 0.5
  const n = Number(arg.split('=')[1])
  return Number.isFinite(n) && n >= 0 ? n : 0.5
}

async function ensureDir(p) {
  await fs.mkdir(path.dirname(p), { recursive: true })
}

async function main() {
  const [,, srcArg, outArg] = process.argv
  if (!srcArg || !outArg) {
    console.error('Usage: node scripts/generate-video-poster.mjs <srcFile> <outFile> [--seek=0.5]')
    process.exit(1)
  }
  const cwd = process.cwd()
  const src = path.resolve(cwd, srcArg)
  const out = path.resolve(cwd, outArg)
  const seek = parseSeek()
  await ensureDir(out)

  await new Promise((resolve, reject) => {
    ffmpeg(src)
      .noAudio()
      .seekInput(seek)
      .frames(1)
      .outputOptions([
        '-qscale:v 3' // quality
      ])
      .save(out)
      .on('end', resolve)
      .on('error', reject)
  })

  console.log('Poster generated at', path.relative(cwd, out))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


