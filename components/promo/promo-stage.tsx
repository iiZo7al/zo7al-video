import { easeOutExpo, progress } from '@/lib/motion'
import { Starfield } from './primitives'
import { SCENES } from './timeline'

export function PromoStage({ time }: { time: number }) {
  const badge = easeOutExpo(progress(time, 4.2, 0.8))

  return (
    <div dir="rtl" className="relative h-[1080px] w-[1920px] overflow-hidden bg-[#07080b] font-sans text-white">
      <Starfield t={time} />
      {SCENES.map(({ id, start, duration, Component }) => {
        const local = time - start
        if (local < 0 || local > duration) return null
        return <Component key={id} t={local} duration={duration} />
      })}

      <div
        dir="ltr"
        className="absolute left-14 top-12 flex items-center gap-3 rounded-full border border-white/10 bg-black/30 px-6 py-3 text-[22px] font-semibold"
        style={{ opacity: badge * (time > 29.5 ? 0 : 1), transition: 'opacity 400ms' }}
      >
        <span className="h-3 w-3 rounded-full bg-[#ff7a00]" />
        Zo7al Projects
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: 'inset 0 0 260px rgba(0,0,0,0.85)' }}
      />
    </div>
  )
}
