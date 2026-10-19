'use client'

import { Download, Maximize, Pause, Play, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { toCanvas } from 'html-to-image'
import { formatTime } from '@/lib/motion'
import { PromoStage } from './promo-stage'
import { getScenes, TOTAL_DURATION } from './timeline'
import { useVideoClock } from './use-video-clock'
import type { Language } from './types'
import { exportMp4, STAGE_HEIGHT, STAGE_WIDTH, VIDEO_FPS, VIDEO_SCALE } from './export-mp4'

type Mp4FileHandle = {
  createWritable: () => Promise<{
    write: (data: Blob) => Promise<void>
    close: () => Promise<void>
  }>
}

type SaveFilePickerWindow = Window & {
  showSaveFilePicker?: (options: {
    suggestedName: string
    types: Array<{ description: string; accept: Record<string, string[]> }>
  }) => Promise<Mp4FileHandle>
}

const labels: Record<Language, { download: string; downloading: string; failed: string; title: string; play: string; pause: string; restart: string; position: string; fullscreen: string; scenes: string }> = {
  ar: { download: 'تحميل الفيديو', downloading: 'جارٍ تجهيز الفيديو…', failed: 'تعذر تصدير الفيديو في هذا المتصفح', title: 'فيديو تعريفي لموقع ZO7AL', play: 'تشغيل', pause: 'إيقاف مؤقت', restart: 'إعادة من البداية', position: 'موضع الفيديو', fullscreen: 'ملء الشاشة', scenes: 'مشاهد الفيديو' },
  en: { download: 'Download video', downloading: 'Exporting video…', failed: 'Video export is not supported by this browser', title: 'ZO7AL website introduction video', play: 'Play', pause: 'Pause', restart: 'Restart', position: 'Video position', fullscreen: 'Fullscreen', scenes: 'Video scenes' },
  es: { download: 'Descargar vídeo', downloading: 'Exportando vídeo…', failed: 'Este navegador no admite la exportación de vídeo', title: 'Vídeo de presentación de ZO7AL', play: 'Reproducir', pause: 'Pausar', restart: 'Reiniciar', position: 'Posición del vídeo', fullscreen: 'Pantalla completa', scenes: 'Escenas del vídeo' },
  fr: { download: 'Télécharger la vidéo', downloading: 'Exportation vidéo…', failed: 'Ce navigateur ne prend pas en charge l’export vidéo', title: 'Vidéo de présentation de ZO7AL', play: 'Lire', pause: 'Pause', restart: 'Recommencer', position: 'Position de la vidéo', fullscreen: 'Plein écran', scenes: 'Scènes vidéo' },
  de: { download: 'Video herunterladen', downloading: 'Video wird exportiert…', failed: 'Dieser Browser unterstützt den Videoexport nicht', title: 'ZO7AL Vorstellungsvideo', play: 'Abspielen', pause: 'Pause', restart: 'Neu starten', position: 'Videoposition', fullscreen: 'Vollbild', scenes: 'Videoszenen' },
  pt: { download: 'Baixar vídeo', downloading: 'Exportando vídeo…', failed: 'Este navegador não oferece suporte à exportação de vídeo', title: 'Vídeo de apresentação do ZO7AL', play: 'Reproduzir', pause: 'Pausar', restart: 'Reiniciar', position: 'Posição do vídeo', fullscreen: 'Tela cheia', scenes: 'Cenas do vídeo' },
  tr: { download: 'Videoyu indir', downloading: 'Video dışa aktarılıyor…', failed: 'Bu tarayıcı video dışa aktarmayı desteklemiyor', title: 'ZO7AL tanıtım videosu', play: 'Oynat', pause: 'Duraklat', restart: 'Baştan başlat', position: 'Video konumu', fullscreen: 'Tam ekran', scenes: 'Video sahneleri' },
  ja: { download: '動画をダウンロード', downloading: '動画をエクスポート中…', failed: 'このブラウザーは動画の書き出しに対応していません', title: 'ZO7AL紹介動画', play: '再生', pause: '一時停止', restart: '最初から', position: '動画の位置', fullscreen: '全画面表示', scenes: '動画シーン' },
  ko: { download: '동영상 다운로드', downloading: '동영상 내보내는 중…', failed: '이 브라우저는 동영상 내보내기를 지원하지 않습니다', title: 'ZO7AL 소개 동영상', play: '재생', pause: '일시정지', restart: '처음부터', position: '동영상 위치', fullscreen: '전체 화면', scenes: '동영상 장면' },
  zh: { download: '下载视频', downloading: '正在导出视频…', failed: '此浏览器不支持视频导出', title: 'ZO7AL 网站介绍视频', play: '播放', pause: '暂停', restart: '重新开始', position: '视频进度', fullscreen: '全屏', scenes: '视频场景' },
}

export function PromoPlayer({ language }: { language: Language }) {
  const { time, playing, toggle, seek, restart, setPlaying } = useVideoClock(TOTAL_DURATION)
  const frameRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)
  const [exporting, setExporting] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportError, setExportError] = useState(false)
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
    if (!stageRef.current || typeof VideoEncoder === 'undefined') {
      setExportError(true)
      return
    }

    const filename = `zo7al-intro-${language}.mp4`
    const pickerWindow = window as SaveFilePickerWindow
    let fileHandle: Mp4FileHandle | undefined

    // Open the save prompt while the click still has a user gesture. Encoding
    // all 3600 frames can take long enough for browsers to block a late download.
    if (pickerWindow.showSaveFilePicker) {
      try {
        fileHandle = await pickerWindow.showSaveFilePicker({
          suggestedName: filename,
          types: [{ description: 'MP4 video', accept: { 'video/mp4': ['.mp4'] } }],
        })
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setExportError(true)
        return
      }
    }

    try {
      setExporting(true)
      setExportError(false)
      setExportProgress(0)
      setPlaying(false)
      seek(0)
      const blob = await exportMp4(async (index) => {
        seek(index / VIDEO_FPS)
        await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
        if (!stageRef.current) throw new Error('Video stage was removed')
        return toCanvas(stageRef.current, { width: STAGE_WIDTH, height: STAGE_HEIGHT, pixelRatio: VIDEO_SCALE })
      }, setExportProgress)
      if (fileHandle) {
        const writable = await fileHandle.createWritable()
        await writable.write(blob)
        await writable.close()
      } else {
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = filename
        anchor.hidden = true
        document.body.append(anchor)
        anchor.click()
        anchor.remove()
        window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
      }
    } catch (error) {
      console.error('MP4 export failed', error)
      setExportError(true)
    } finally {
      setExporting(false)
      setPlaying(false)
    }
  }

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
            disabled={exporting}
            aria-label={playing ? copy.pause : copy.play}
            className="absolute inset-0 z-10 cursor-pointer"
          />
          {scale > 0 && (
            <div className="absolute left-0 top-0 origin-top-left" style={{ transform: `scale(${scale})` }}>
              <PromoStage time={time} language={language} stageRef={stageRef} />
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
            disabled={exporting}
            aria-label={playing ? copy.pause : copy.play}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ff7a00] text-black transition-transform hover:scale-105"
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={restart}
            disabled={exporting}
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
            disabled={exporting}
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
                disabled={exporting}
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
        <button type="button" onClick={downloadVideo} disabled={exporting || scale === 0} className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#ff7a00] px-5 py-3 font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60">
          <Download className="h-4 w-4" />{exporting ? `${copy.downloading} ${Math.round(exportProgress * 100)}%` : copy.download}
        </button>
        {exportError && <p role="status" className="text-sm text-red-300">{copy.failed}</p>}
      </div>
    </div>
  )
}
