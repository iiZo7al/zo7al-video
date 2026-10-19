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

export const AUDIO_URL = '/video/promo-audio.wav'
const AUDIO_CODEC = 'mp4a.40.2'
const AUDIO_BITRATE = 192_000
const AUDIO_CHUNK_FRAMES = 4096

type AudioSamples = {
  sampleRate: number
  channels: Float32Array[]
  frames: number
}

export type AudioChunk = {
  chunk: EncodedAudioChunk
  metadata?: EncodedAudioChunkMetadata
}

export type AudioTrackOptions = {
  sampleRate: number
  numberOfChannels: number
}

function ascii(view: DataView, offset: number, length: number) {
  let out = ''
  for (let index = 0; index < length; index += 1) out += String.fromCharCode(view.getUint8(offset + index))
  return out
}

// Only 16-bit PCM WAV is accepted — that is exactly what the bundled narration is,
// and keeping the parser strict avoids surprises from the resampling an AudioContext would do.
function parseWav(buffer: ArrayBuffer): AudioSamples {
  const view = new DataView(buffer)
  if (view.byteLength < 44 || ascii(view, 0, 4) !== 'RIFF' || ascii(view, 8, 4) !== 'WAVE') {
    throw new Error('The narration file is not a valid WAV file.')
  }
  let offset = 12
  let format = 0
  let bitsPerSample = 0
  let sampleRate = 0
  let channels = 0
  let data: Uint8Array | undefined
  while (offset + 8 <= view.byteLength) {
    const id = ascii(view, offset, 4)
    const size = view.getUint32(offset + 4, true)
    const start = offset + 8
    if (id === 'fmt ') {
      format = view.getUint16(start, true)
      channels = view.getUint16(start + 2, true)
      sampleRate = view.getUint32(start + 4, true)
      bitsPerSample = view.getUint16(start + 14, true)
    } else if (id === 'data') {
      data = new Uint8Array(buffer, start, Math.max(0, Math.min(size, view.byteLength - start)))
    }
    offset = start + size + (size % 2)
  }
  if (!data || !channels || !sampleRate) throw new Error('The narration WAV is missing its metadata.')
  if (format !== 1 || bitsPerSample !== 16) {
    throw new Error(`Unsupported narration WAV encoding: format ${format}, ${bitsPerSample}-bit.`)
  }
  const usableChannels = Math.min(channels, 2)
  const bytesPerFrame = channels * 2
  const frames = Math.floor(data.byteLength / bytesPerFrame)
  const decoded: Float32Array[] = []
  for (let channel = 0; channel < usableChannels; channel += 1) {
    const samples = new Float32Array(frames)
    for (let index = 0; index < frames; index += 1) {
      const at = (index * channels + channel) * 2
      const value = (data[at + 1] << 8) | data[at]
      samples[index] = ((value << 16) >> 16) / 32768
    }
    decoded.push(samples)
  }
  return { sampleRate, channels: decoded, frames }
}

export async function loadAudioSamples(): Promise<AudioSamples> {
  const response = await fetch(AUDIO_URL)
  if (!response.ok) throw new Error(`Failed to load the narration audio (HTTP ${response.status}).`)
  return parseWav(await response.arrayBuffer())
}

export async function encodeAudio(samples: AudioSamples): Promise<AudioChunk[]> {
  if (typeof AudioEncoder === 'undefined' || typeof AudioData === 'undefined') {
    console.warn('MP4 export: WebCodecs audio is unavailable, exporting without audio.')
    return []
  }
  const config: AudioEncoderConfig = {
    codec: AUDIO_CODEC,
    sampleRate: samples.sampleRate,
    numberOfChannels: samples.channels.length,
    bitrate: AUDIO_BITRATE,
  }
  if (!(await AudioEncoder.isConfigSupported(config)).supported) {
    console.warn('MP4 export: AAC encoding is unsupported here, exporting without audio.')
    return []
  }
  const chunks: AudioChunk[] = []
  let encoderError: Error | undefined
  const encoder = new AudioEncoder({
    output: (chunk, metadata) => chunks.push({ chunk, metadata }),
    error: (error) => { encoderError = error },
  })
  encoder.configure(config)
  // Trim or (conceptually) hold the narration to the video length; anything past
  // TOTAL_DURATION would outlive the last frame in the muxed file.
  const totalFrames = Math.min(samples.frames, Math.round(TOTAL_DURATION * samples.sampleRate))
  try {
    for (let offset = 0; offset < totalFrames; offset += AUDIO_CHUNK_FRAMES) {
      const count = Math.min(AUDIO_CHUNK_FRAMES, totalFrames - offset)
      const data = new Float32Array(count * samples.channels.length)
      samples.channels.forEach((channel, index) => {
        data.set(channel.subarray(offset, offset + count), index * count)
      })
      const audioData = new AudioData({
        format: 'f32-planar',
        sampleRate: samples.sampleRate,
        numberOfFrames: count,
        numberOfChannels: samples.channels.length,
        timestamp: Math.round((offset * 1_000_000) / samples.sampleRate),
        data,
      })
      encoder.encode(audioData)
      audioData.close()
      if (encoder.encodeQueueSize > 8) await encoder.flush()
    }
    await encoder.flush()
  } finally {
    encoder.close()
  }
  if (encoderError) throw encoderError
  return chunks
}

function createMuxer(target: ArrayBufferTarget, audio?: AudioTrackOptions) {
  return new Muxer({
    target,
    video: { codec: 'avc', width: VIDEO_WIDTH, height: VIDEO_HEIGHT, frameRate: VIDEO_FPS },
    audio: audio ? { codec: 'aac', numberOfChannels: audio.numberOfChannels, sampleRate: audio.sampleRate } : undefined,
    fastStart: 'in-memory',
  })
}

export async function exportMp4(renderFrame: (frame: number) => Promise<HTMLCanvasElement>, onProgress: (progress: number) => void) {
  if (typeof VideoEncoder === 'undefined' || typeof VideoFrame === 'undefined') {
    throw new Error('This browser does not support MP4 export.')
  }

  // Narration is encoded up front: a broken audio pipeline fails fast instead of
  // after an hour of frame rendering. Failures to read the file are real bugs and
  // must not silently produce a silent video; only a missing encoder degrades.
  let samples: AudioSamples | undefined
  if (typeof AudioEncoder === 'undefined' || typeof AudioData === 'undefined') {
    console.warn('MP4 export: AudioEncoder is unavailable, exporting without audio.')
  } else {
    samples = await loadAudioSamples()
  }
  const audioChunks = samples ? await encodeAudio(samples) : []

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
  const muxer = createMuxer(
    target,
    audioChunks.length && samples ? { sampleRate: samples.sampleRate, numberOfChannels: samples.channels.length } : undefined,
  )
  for (const { chunk, metadata } of audioChunks) muxer.addAudioChunk(chunk, metadata)

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
