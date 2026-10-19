import type { CSSProperties, ReactNode } from 'react'
import { easeInCubic, easeOutExpo, progress, seededRandom } from '@/lib/motion'

type RevealProps = {
  t: number
  at: number
  dur?: number
  y?: number
  x?: number
  blur?: number
  scaleFrom?: number
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export function Reveal({
  t,
  at,
  dur = 0.9,
  y = 40,
  x = 0,
  blur = 10,
  scaleFrom = 1,
  className,
  style,
  children,
}: RevealProps) {
  const p = easeOutExpo(progress(t, at, dur))
  const scale = scaleFrom + (1 - scaleFrom) * p
  return (
    <div
      className={className}
      style={{
        opacity: p,
        transform: `translate3d(${(1 - p) * x}px, ${(1 - p) * y}px, 0) scale(${scale})`,
        filter: blur ? `blur(${(1 - p) * blur}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

type SceneShellProps = {
  t: number
  duration: number
  accent: string
  hold?: boolean
  glowPosition?: string
  children: ReactNode
}

const FADE = 0.55

export function SceneShell({
  t,
  duration,
  accent,
  hold = false,
  glowPosition = '70% 40%',
  children,
}: SceneShellProps) {
  const enter = easeOutExpo(progress(t, 0, FADE))
  const exit = hold ? 0 : easeInCubic(progress(t, duration - FADE, FADE))
  const opacity = enter * (1 - exit)
  const scale = 1.035 - 0.035 * enter - 0.03 * exit

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ opacity, transform: `scale(${scale})`, filter: exit ? `blur(${exit * 8}px)` : undefined }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `radial-gradient(900px 640px at ${glowPosition}, color-mix(in srgb, ${accent} 26%, transparent), transparent 70%)`,
        }}
      />
      <div className="relative h-full w-full">{children}</div>
    </div>
  )
}

const random = seededRandom(7)
const STARS = Array.from({ length: 140 }, () => ({
  x: random() * 1920,
  y: random() * 1080,
  size: random() * 2.2 + 0.6,
  depth: random() * 0.8 + 0.2,
  phase: random() * Math.PI * 2,
}))

export function Starfield({ t }: { t: number }) {
  return (
    <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 1920 1080">
      {STARS.map((star, i) => {
        const x = (star.x - t * 18 * star.depth + 1920 * 4) % 1920
        const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(t * 1.2 * star.depth + star.phase))
        return <circle key={i} cx={x} cy={star.y} r={star.size} fill="#fff" opacity={twinkle * star.depth} />
      })}
    </svg>
  )
}

export function Eyebrow({ children, accent }: { children: ReactNode; accent: string }) {
  return (
    <div className="flex items-center gap-4 text-[26px] font-semibold text-[#8f96a3]">
      <span className="h-3 w-3 rounded-full" style={{ background: accent, boxShadow: `0 0 18px ${accent}` }} />
      {children}
    </div>
  )
}

export function TitleWords({
  t,
  at,
  words,
  stagger = 0.12,
  className,
  accentIndex,
  accent,
}: {
  t: number
  at: number
  words: string[]
  stagger?: number
  className?: string
  accentIndex?: number
  accent?: string
}) {
  return (
    <h2 className={className}>
      {words.map((word, i) => (
        <Reveal
          key={`${word}-${i}`}
          t={t}
          at={at + i * stagger}
          y={70}
          blur={14}
          className="inline-block"
          style={{ color: i === accentIndex ? accent : undefined, marginInlineEnd: '0.25em' }}
        >
          {word}
        </Reveal>
      ))}
    </h2>
  )
}
