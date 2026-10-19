import { easeOutBack, easeOutExpo, progress } from '@/lib/motion'
import { Reveal, SceneShell } from '../primitives'
import type { SceneProps } from '../types'

export function OutroScene({ t, duration }: SceneProps) {
  const bg = easeOutExpo(progress(t, 0, 1.6))
  const logo = easeOutBack(progress(t, 0.5, 1))
  const float = Math.sin(t * 1.6) * 10

  return (
    <SceneShell t={t} duration={duration} accent="#ff7a00" glowPosition="50% 40%" hold>
      <img
        src="/video/lost-saturn-hq.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: bg * 0.6, transform: `scale(${1.15 - t * 0.02})` }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-[#07080b]/60 to-[#07080b]/80" />

      <div className="relative flex h-full flex-col items-center justify-center text-center">
        <img
          src="/video/server-logo.png"
          alt="شعار ZO7AL"
          width={260}
          height={260}
          style={{
            transform: `translateY(${float}px) scale(${logo}) rotate(${(1 - logo) * 25}deg)`,
            filter: 'drop-shadow(0 0 60px rgba(255,122,0,0.55))',
          }}
        />
        <Reveal t={t} at={1.1} className="mt-8 text-[120px] font-bold leading-none text-white">
          <span dir="ltr">
            ZO<span className="text-[#ff7a00]">7</span>AL
          </span>
        </Reveal>
        <Reveal t={t} at={1.3} className="mt-4 text-[40px] font-semibold tracking-[0.6em] text-[#ff7a00]">
          <span dir="ltr" className="ps-[0.6em]">
            PROJECTS
          </span>
        </Reveal>
        <Reveal t={t} at={1.5} className="mt-8 text-[48px] font-semibold text-[#c9ced6]">
          ابنِ. العب. أبدع.
        </Reveal>
        <Reveal
          t={t}
          at={2}
          y={20}
          className="mt-12 flex items-center gap-4 rounded-full border border-white/15 bg-white/5 px-10 py-5 text-[36px] font-semibold text-white"
        >
          <span className="h-3.5 w-3.5 rounded-full bg-[#ff7a00]" style={{ boxShadow: '0 0 16px #ff7a00' }} />
          <span dir="ltr">zo7al.is-a.dev</span>
        </Reveal>
      </div>
    </SceneShell>
  )
}
