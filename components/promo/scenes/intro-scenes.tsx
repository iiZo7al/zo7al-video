'use client'

import dynamic from 'next/dynamic'
import { easeOutExpo, progress } from '@/lib/motion'
import { Reveal, SceneShell } from '../primitives'
import type { SceneProps } from '../types'
import { tr } from '../translations'

const ORANGE = '#ff7a00'
const Saturn3D = dynamic(() => import('../saturn-3d'), { ssr: false })

export function IntroScene({ t, duration, language = 'ar' }: SceneProps) {
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

        <Reveal
          t={t}
          at={2.9}
          className="mt-6 max-w-[1500px] px-10 text-center text-[34px] leading-relaxed text-[#c9ced6]"
        >
          {tr(language, 'headlineDesc')}
        </Reveal>
      </div>
    </SceneShell>
  )
}
