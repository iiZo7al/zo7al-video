'use client'

import dynamic from 'next/dynamic'
import { easeOutExpo, progress } from '@/lib/motion'
import { Reveal, SceneShell } from '../primitives'
import type { SceneProps } from '../types'

const ORANGE = '#ff7a00'
const Saturn3D = dynamic(() => import('../saturn-3d'), { ssr: false })

export function IntroScene({ t, duration }: SceneProps) {
  const letters = 'ZO7AL'.split('')
  const projects = easeOutExpo(progress(t, 2.3, 1))

  return (
    <SceneShell t={t} duration={duration} accent={ORANGE} glowPosition="50% 40%">
      <div className="flex h-full flex-col items-center justify-center">
        <div className="relative h-[600px] w-full">
          <Saturn3D t={t} />
        </div>

        <div dir="ltr" className="-mt-6 flex text-[140px] font-bold leading-none tracking-tight text-white">
          {letters.map((letter, i) => {
            const p = easeOutExpo(progress(t, 1.9 + i * 0.09, 0.9))
            return (
              <span
                key={i}
                className="inline-block"
                style={{
                  opacity: p,
                  transform: `translateY(${(1 - p) * 90}px) rotate(${(1 - p) * 8}deg)`,
                  filter: `blur(${(1 - p) * 12}px)`,
                  color: letter === '7' ? ORANGE : undefined,
                }}
              >
                {letter}
              </span>
            )
          })}
        </div>

        <div
          dir="ltr"
          className="mt-5 text-[46px] font-semibold text-[#ff7a00]"
          style={{
            opacity: projects,
            letterSpacing: `${0.9 - 0.3 * projects}em`,
            paddingLeft: `${0.9 - 0.3 * projects}em`,
            filter: `blur(${(1 - projects) * 8}px)`,
          }}
        >
          PROJECTS
        </div>

        <Reveal t={t} at={2.9} className="mt-6 text-[30px] text-[#8f96a3]">
          <span dir="ltr">@iiZo7al</span> — عالم زحل الترفيهي
        </Reveal>
      </div>
    </SceneShell>
  )
}

const HEADLINE = [
  { word: 'ابنِ.', at: 0.3 },
  { word: 'العب.', at: 0.95 },
  { word: 'أبدع.', at: 1.6 },
]

export function HeadlineScene({ t, duration }: SceneProps) {
  return (
    <SceneShell t={t} duration={duration} accent={ORANGE} glowPosition="50% 55%">
      <div className="flex h-full flex-col items-center justify-center">
        <div className="flex items-baseline gap-14 text-[210px] font-bold leading-[1.1] text-white">
          {HEADLINE.map(({ word, at }, i) => {
            const p = easeOutExpo(progress(t, at, 0.75))
            const isLast = i === HEADLINE.length - 1
            return (
              <span
                key={word}
                className="inline-block"
                style={{
                  opacity: p,
                  transform: `scale(${1.6 - 0.6 * p})`,
                  filter: `blur(${(1 - p) * 18}px)`,
                  color: isLast ? 'transparent' : undefined,
                  backgroundImage: isLast ? 'linear-gradient(120deg, #ffc94a, #ff7a00 60%, #ff4d00)' : undefined,
                  backgroundClip: isLast ? 'text' : undefined,
                  WebkitBackgroundClip: isLast ? 'text' : undefined,
                }}
              >
                {word}
              </span>
            )
          })}
        </div>
        <Reveal t={t} at={2.4} className="mt-10 max-w-[1300px] text-center text-[40px] leading-relaxed text-[#c9ced6]">
          سيرفرات ماينكرافت، مابات فورتنايت، مودباكات، ومشاريع ألعاب من زحل.
        </Reveal>
        <Reveal t={t} at={2.9} className="mt-8 text-[22px] font-semibold tracking-[0.4em] text-[#8f96a3]">
          <span dir="ltr">BUILD · PLAY · CREATE</span>
        </Reveal>
      </div>
    </SceneShell>
  )
}
