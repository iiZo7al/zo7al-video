'use client'

import { Download, Maximize, Pause, Play, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { formatTime } from '@/lib/motion'
import { PromoStage } from './promo-stage'
import { getScenes, TOTAL_DURATION } from './timeline'
import { useVideoClock } from './use-video-clock'
import type { Language } from './types'

const STAGE_WIDTH = 1920

const labels: Record<Language, { download: string; downloading: string; failed: string; title: string; play: string; pause: string; restart: string; position: string; fullscreen: string; scenes: string }> = {
  ar: { download: 'تحميل الفيديو', downloading: 'جارٍ تسجيل الفيديو…', failed: 'تعذر بدء تسجيل الفيديو', title: 'فيديو تعريفي لموقع ZO7AL', play: 'تشغيل', pause: 'إيقاف مؤقت', restart: 'إعادة من البداية', position: 'موضع الفيديو', fullscreen: 'ملء الشاشة', scenes: 'مشاهد الفيديو' },
  en: { download: 'Download video', downloading: 'Recording video…', failed: 'Could not start video recording', title: 'ZO7AL website introduction video', play: 'Play', pause: 'Pause', restart: 'Restart', position: 'Video position', fullscreen: 'Fullscreen', scenes: 'Video scenes' },
  es: { download: 'Descargar vídeo', downloading: 'Grabando vídeo…', failed: 'No se pudo iniciar la grabación', title: 'Vídeo de presentación de ZO7AL', play: 'Reproducir', pause: 'Pausar', restart: 'Reiniciar', position: 'Posición del vídeo', fullscreen: 'Pantalla completa', scenes: 'Escenas del vídeo' },
  fr: { download: 'Télécharger la vidéo', downloading: 'Enregistrement…', failed: 'Impossible de lancer l’enregistrement', title: 'Vidéo de présentation de ZO7AL', play: 'Lire', pause: 'Pause', restart: 'Recommencer', position: 'Position de la vidéo', fullscreen: 'Plein écran', scenes: 'Scènes vidéo' },
  de: { download: 'Video herunterladen', downloading: 'Video wird aufgenommen…', failed: 'Videoaufnahme konnte nicht gestartet werden', title: 'ZO7AL Vorstellungsvideo', play: 'Abspielen', pause: 'Pause', restart: 'Neu starten', position: 'Videoposition', fullscreen: 'Vollbild', scenes: 'Videoszenen' },
  pt: { download: 'Baixar vídeo', downloading: 'Gravando vídeo…', failed: 'Não foi possível iniciar a gravação', title: 'Vídeo de apresentação do ZO7AL', play: 'Reproduzir', pause: 'Pausar', restart: 'Reiniciar', position: 'Posição do vídeo', fullscreen: 'Tela cheia', scenes: 'Cenas do vídeo' },
  tr: { download: 'Videoyu indir', downloading: 'Video kaydediliyor…', failed: 'Video kaydı başlatılamadı', title: 'ZO7AL tanıtım videosu', play: 'Oynat', pause: 'Duraklat', restart: 'Baştan başlat', position: 'Video konumu', fullscreen: 'Tam ekran', scenes: 'Video sahneleri' },
  ja: { download: '動画をダウンロード', downloading: '動画を録画中…', failed: '録画を開始できませんでした', title: 'ZO7AL紹介動画', play: '再生', pause: '一時停止', restart: '最初から', position: '動画の位置', fullscreen: '全画面表示', scenes: '動画シーン' },
  ko: { download: '동영상 다운로드', downloading: '동영상 녹화 중…', failed: '녹화를 시작할 수 없습니다', title: 'ZO7AL 소개 동영상', play: '재생', pause: '일시정지', restart: '처음부터', position: '동영상 위치', fullscreen: '전체 화면', scenes: '동영상 장면' },
  zh: { download: '下载视频', downloading: '正在录制视频…', failed: '无法开始录制视频', title: 'ZO7AL 网站介绍视频', play: '播放', pause: '暂停', restart: '重新开始', position: '视频进度', fullscreen: '全屏', scenes: '视频场景' },
}

export function PromoPlayer({ language }: { language: Language }) {
  const { time, playing, toggle, seek, restart, setPlaying } = useVideoClock(TOTAL_DURATION)
  const frameRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)
  const [recording, setRecording] = useState(false)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const copy = labels[language]
  const scenes = getScenes(language)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / STAGE_WIDTH))
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  const activeScene = [...scenes].reverse().find((scene) => time >= scene.start) ?? scenes[0]
  const ended = time >= TOTAL_DURATION

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLButtonElement) return
    if (event.key === ' ' || event.key === 'k') {
      event.preventDefault()
      toggle()
    } else if (event.key === 'ArrowRight') {
      seek(time + 3)
    } else if (event.key === 'ArrowLeft') {
      seek(time - 3)
    }
  }

  const enterFullscreen = () => {
    containerRef.current?.requestFullscreen?.()
  }

  const downloadVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 30 }, audio: false, preferCurrentTab: true } as DisplayMediaStreamOptions)
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm'
      const recorder = new MediaRecorder(stream, { mimeType })
      chunksRef.current = []
      recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data) }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = 'zo7al-intro.webm'
        anchor.click()
        window.setTimeout(() => URL.revokeObjectURL(url), 1000)
        stream.getTracks().forEach((track) => track.stop())
        setRecording(false)
      }
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        if (recorder.state !== 'inactive') recorder.stop()
      }, { once: true })
      recorderRef.current = recorder
      seek(0)
      setPlaying(true)
      setRecording(true)
      recorder.start()
    } catch {
      window.alert(copy.failed)
    }
  }

  useEffect(() => {
    if (recording && ended && recorderRef.current?.state !== 'inactive') recorderRef.current?.stop()
  }, [ended, recording])

  return (
    <div className="flex w-full flex-col gap-5">
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={copy.title}
        role="region"
        className="group relative flex w-full flex-col justify-center overflow-hidden rounded-3xl border border-white/10 bg-black shadow-[0_40px_120px_rgba(0,0,0,0.6)] focus-visible:outline-2 focus-visible:outline-[#19d9ff]"
      >
        <div ref={frameRef} className="relative aspect-video w-full overflow-hidden">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? copy.pause : copy.play}
            className="absolute inset-0 z-10 cursor-pointer"
          />
          {scale > 0 && (
            <div className="absolute left-0 top-0 origin-top-left" style={{ transform: `scale(${scale})` }}>
              <PromoStage time={time} />
            </div>
          )}
          {!playing && (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/20">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ff7a00] text-black shadow-[0_0_60px_rgba(255,122,0,0.6)]">
                {ended ? <RotateCcw className="h-9 w-9" /> : <Play className="h-9 w-9 translate-x-0.5" />}
              </span>
            </div>
          )}
        </div>
      </div>

      <div dir="rtl" className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#11141b] p-4 md:p-5">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? copy.pause : copy.play}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ff7a00] text-black transition-transform hover:scale-105"
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={restart}
            aria-label={copy.restart}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"
          >
            <RotateCcw className="h-5 w-5" />
          </button>

          <label className="sr-only" htmlFor="promo-scrubber">
            {copy.position}
          </label>
          <input
            id="promo-scrubber"
            type="range"
            min={0}
            max={TOTAL_DURATION}
            step={0.01}
            value={time}
            onPointerDown={() => setPlaying(false)}
            onChange={(event) => seek(Number(event.target.value))}
            className="h-2 flex-1 cursor-pointer accent-[#ff7a00]"
            dir="ltr"
          />

          <span dir="ltr" className="w-24 shrink-0 text-center font-mono text-sm tabular-nums text-[#8f96a3]">
            {formatTime(time)} / {formatTime(TOTAL_DURATION)}
          </span>

          <button
            type="button"
            onClick={enterFullscreen}
            aria-label={copy.fullscreen}
            className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10 sm:flex"
          >
            <Maximize className="h-5 w-5" />
          </button>
        </div>

        <nav aria-label={copy.scenes} className="flex flex-wrap gap-2">
          {scenes.map((scene) => {
            const isActive = scene.id === activeScene.id
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => {
                  seek(scene.start + (scene.start === 0 ? 0 : 0.5))
                  setPlaying(true)
                }}
                aria-current={isActive ? 'true' : undefined}
                className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors"
                style={{
                  borderColor: isActive ? scene.accent : 'rgba(255,255,255,0.1)',
                  background: isActive ? `color-mix(in srgb, ${scene.accent} 14%, transparent)` : 'transparent',
                  color: isActive ? '#fff' : '#8f96a3',
                }}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: scene.accent }} />
                {scene.label}
              </button>
            )
          })}
        </nav>
        <button type="button" onClick={downloadVideo} disabled={recording} className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#ff7a00] px-5 py-3 font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60">
          <Download className="h-4 w-4" />{recording ? copy.downloading : copy.download}
        </button>
      </div>
    </div>
  )
}
