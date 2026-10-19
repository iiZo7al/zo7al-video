import { ArrayBufferTarget, Muxer } from 'mp4-muxer'

export const VIDEO_WIDTH = 1920
export const VIDEO_HEIGHT = 1080
export const VIDEO_FPS = 24
export const VIDEO_FRAMES = 35 * VIDEO_FPS

export async function exportMp4(renderFrame: (frame: number) => Promise<HTMLCanvasElement>, onProgress: (progress: number) => void) {
  if (typeof VideoEncoder === 'undefined' || typeof VideoFrame === 'undefined') {
    throw new Error('This browser does not support MP4 export.')
  }

  const configCandidates: VideoEncoderConfig[] = [
    { codec: 'avc1.640028', width: VIDEO_WIDTH, height: VIDEO_HEIGHT, bitrate: 8_000_000, framerate: VIDEO_FPS },
    { codec: 'avc1.4d0028', width: VIDEO_WIDTH, height: VIDEO_HEIGHT, bitrate: 6_000_000, framerate: VIDEO_FPS },
    { codec: 'avc1.420028', width: VIDEO_WIDTH, height: VIDEO_HEIGHT, bitrate: 4_000_000, framerate: VIDEO_FPS },
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
