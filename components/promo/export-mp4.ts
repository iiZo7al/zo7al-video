import { ArrayBufferTarget, Muxer } from 'mp4-muxer'
import { TOTAL_DURATION } from './timeline'

export const STAGE_WIDTH = 1920
export const STAGE_HEIGHT = 1080
// The stage is authored at 1080p; exports rasterise it at 4K through VIDEO_SCALE.
export const VIDEO_WIDTH = 3840
export const VIDEO_HEIGHT = 2160
export const VIDEO_FPS = 120
export const VIDEO_SCALE = VIDEO_WIDTH / STAGE_WIDTH
export const VIDEO_FRAMES = TOTAL_DURATION * VIDEO_FPS

export async function exportMp4(renderFrame: (frame: number) => Promise<HTMLCanvasElement>, onProgress: (progress: number) => void) {
  if (typeof VideoEncoder === 'undefined' || typeof VideoFrame === 'undefined') {
    throw new Error('This browser does not support MP4 export.')
  }

  const configCandidates: VideoEncoderConfig[] = [
    // 4K@120 needs an H.264 level of 5.1+; level 4.0 (avc1.640028) is rejected at this size.
    { codec: 'avc1.640034', width: VIDEO_WIDTH, height: VIDEO_HEIGHT, bitrate: 48_000_000, framerate: VIDEO_FPS },
    { codec: 'avc1.640033', width: VIDEO_WIDTH, height: VIDEO_HEIGHT, bitrate: 48_000_000, framerate: VIDEO_FPS },
    { codec: 'avc1.4d0034', width: VIDEO_WIDTH, height: VIDEO_HEIGHT, bitrate: 40_000_000, framerate: VIDEO_FPS },
    { codec: 'avc1.420034', width: VIDEO_WIDTH, height: VIDEO_HEIGHT, bitrate: 24_000_000, framerate: VIDEO_FPS },
  ]
  let config: VideoEncoderConfig | undefined
  for (const candidate of configCandidates) {
    if ((await VideoEncoder.isConfigSupported(candidate)).supported) {
      config = candidate
      break
    }
  }
  if (!config) throw new Error('This browser does not support H.264 MP4 encoding.')

  const target = new ArrayBufferTarget()
  const muxer = new Muxer({
    target,
    video: { codec: 'avc', width: VIDEO_WIDTH, height: VIDEO_HEIGHT, frameRate: VIDEO_FPS },
    fastStart: 'in-memory',
  })
  let encoderError: Error | undefined
  const encoder = new VideoEncoder({
    output: (chunk, metadata) => muxer.addVideoChunk(chunk, metadata),
    error: (error) => { encoderError = error },
  })
  encoder.configure(config)

  try {
    for (let index = 0; index < VIDEO_FRAMES; index += 1) {
      const canvas = await renderFrame(index)
      const timestamp = Math.round((index * 1_000_000) / VIDEO_FPS)
      const frame = new VideoFrame(canvas, { timestamp, duration: Math.round(1_000_000 / VIDEO_FPS) })
      encoder.encode(frame, { keyFrame: index % (VIDEO_FPS * 2) === 0 })
      frame.close()
      if (encoder.encodeQueueSize > 4) await encoder.flush()
      onProgress((index + 1) / VIDEO_FRAMES)
      if (index % 4 === 3) await new Promise<void>((resolve) => setTimeout(resolve, 0))
    }
    await encoder.flush()
    if (encoderError) throw encoderError
    muxer.finalize()
    return new Blob([target.buffer], { type: 'video/mp4' })
  } finally {
    encoder.close()
  }
}
