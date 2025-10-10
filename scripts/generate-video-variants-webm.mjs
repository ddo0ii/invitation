#!/usr/bin/env node
/*
Usage:
  node scripts/generate-video-variants-webm.mjs <srcFile> <outDir> [--heights=240,360,480,720] [--force]

Example:
  node scripts/generate-video-variants-webm.mjs public/video/intro.mp4 public/video/variants --heights=240,360,480,720 --force

Generates VP9 WebM variants. Skips work if outputs are newer than input unless --force.
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
    // VP9 CRF: 0(best) ~ 63(worst). 낮을수록 고품질 (품질 상향)
    const crf = height <= 240 ? 32 : height <= 360 ? 30 : height <= 480 ? 28 : height <= 720 ? 27 : 26
    ffmpeg(src)
      .videoCodec('libvpx-vp9')
      .noAudio()
      .fps(24)
      .size(`?x${height}`)
      .outputOptions([
        '-b:v 0', // CRF 모드
        `-crf ${crf}`,
        '-row-mt 1',
        '-cpu-used 4', // 인코딩 속도/효율 밸런스
        '-deadline good',
      ])
      .on('end', resolve)
      .on('error', reject)
      .save(out)
  })
}

async function main() {
  const [,, srcFileArg, outDirArg] = process.argv
  if (!srcFileArg || !outDirArg) {
    console.error('Usage: node scripts/generate-video-variants-webm.mjs <srcFile> <outDir> [--heights=240,360,480,720] [--force]')
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
    const outPath = path.join(outDir, `${base}-${h}.webm`)
    const outOk = await exists(outPath)
    if (outOk && !force) {
      const outStat = await fs.stat(outPath)
      if (outStat.mtimeMs >= srcStat.mtimeMs) {
        continue
      }
    }
    process.stdout.write(`Generating ${path.relative(cwd, outPath)}...\n`)
    await transcodeVariant(srcFile, outPath, h)
  }

  console.log('Done generating webm variants.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


