import {
  siDiscord,
  siInstagram,
  siKick,
  siSnapchat,
  siTiktok,
  siTwitch,
  siX,
  siYoutube,
} from 'simple-icons'
import { easeOutBack, easeOutExpo, progress } from '@/lib/motion'
import { BrandIcon } from '../brand-icon'
import { Eyebrow, Reveal, SceneShell, TitleWords } from '../primitives'
import type { SceneProps } from '../types'
import { localizeMapTitle, tr } from '../translations'

const PURPLE = '#8b5cf6'
const CYAN = '#19d9ff'
const ORANGE = '#ff7a00'

const ISLANDS = [
  { code: '4162-0323-5737', title: 'Doomspire Brickbattle' },
  { code: '0633-4212-9611', title: 'سنايبرات زحل' },
  { code: '3325-4001-0926', title: 'SOLO SCRIMS GALAXY' },
  { code: '4904-5829-1966', title: 'ALL WEAPONS' },
  { code: '6995-1684-7602', title: '1v1v1 Reload' },
  { code: '2994-5126-9804', title: 'Best 1v1 Map' },
  { code: '3310-5985-8629', title: 'أحمر مقابل أزرق' },
  { code: '2404-2844-7787', title: 'عاركني بالبناء' },
]

export function FortniteScene({ t, duration, language = 'ar' }: SceneProps) {
  return (
    <SceneShell t={t} duration={duration} accent={PURPLE} glowPosition="50% 30%">
      <div className="flex h-full flex-col justify-center px-[150px]">
        <div className="flex items-end justify-between gap-10">
          <div>
            <Reveal t={t} at={0.2}>
              <Eyebrow accent={PURPLE}>{tr(language, 'fortEyebrow')}</Eyebrow>
            </Reveal>
            <TitleWords
              t={t}
              at={0.35}
              words={tr(language, 'fortTitle').split('|')}
              accentIndex={1}
              accent={PURPLE}
              stagger={0.08}
              className="mt-6 text-[96px] font-bold leading-[1.1] text-white"
            />
          </div>
          <Reveal
            t={t}
            at={1}
            y={20}
            className="mb-4 inline-flex items-center gap-4 rounded-full border border-[#8b5cf6]/40 bg-[#8b5cf6]/15 px-8 py-4 text-[28px] font-semibold text-white"
          >
            {tr(language, 'creator')}
            <span dir="ltr" className="text-[#19d9ff]">
              Zo7al
            </span>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-4 gap-6" style={{ perspective: '1800px' }}>
          {ISLANDS.map((island, i) => {
            const p = easeOutExpo(progress(t, 0.7 + i * 0.12, 0.9))
            return (
              <div
                key={island.code}
                className="overflow-hidden rounded-[24px] border border-white/10 bg-[#11141b]/90"
                style={{
                  opacity: p,
                  transform: `rotateX(${(1 - p) * -60}deg) translateY(${(1 - p) * 60}px) scale(${0.92 + 0.08 * p})`,
                  transformOrigin: 'top center',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.45), 0 0 40px rgba(139,92,246,0.12)',
                }}
              >
                <img
                  src={`/video/maps/${island.code}.jpg`}
                  alt={island.title}
                  className="aspect-video w-full object-cover"
                  style={{ transform: `scale(${1.12 - 0.12 * p})` }}
                />
                <div className="flex items-center justify-between gap-3 px-5 py-4">
                  <span className="truncate text-[22px] font-semibold text-white">{localizeMapTitle(language, island.code, island.title)}</span>
                  <span dir="ltr" className="shrink-0 font-mono text-[18px] text-[#c4b5fd]">
                    {island.code}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </SceneShell>
  )
}

const SOCIALS = [siYoutube, siDiscord, siTiktok, siInstagram, siX, siTwitch, siKick, siSnapchat]

export function SocialsScene({ t, duration, language = 'ar' }: SceneProps) {
  const radiusX = 640
  const radiusY = 300
  return (
    <SceneShell t={t} duration={duration} accent={CYAN} glowPosition="50% 50%">
      <div className="relative flex h-full flex-col items-center justify-center text-center">
        {SOCIALS.map((icon, i) => {
          const p = easeOutBack(progress(t, 0.5 + i * 0.1, 0.8))
          const angle = (i / SOCIALS.length) * Math.PI * 2 + t * 0.25
          const x = Math.cos(angle) * radiusX
          const y = Math.sin(angle) * radiusY
          return (
            <div
              key={icon.slug}
              className="absolute flex h-[132px] w-[132px] items-center justify-center rounded-[34px] border border-white/10 bg-[#11141b]/90"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${Math.max(0, p)})`,
                boxShadow: `0 0 50px color-mix(in srgb, ${
                  icon.slug === 'instagram' ? '#E1306C' : `#${icon.hex === '000000' ? 'ffffff' : icon.hex}`
                } 25%, transparent)`,
              }}
            >
              <BrandIcon icon={icon} size={62} />
            </div>
          )
        })}

        <div className="relative z-10">
          <Reveal t={t} at={0.2} className="flex justify-center">
            <Eyebrow accent={CYAN}>{tr(language, 'socialEyebrow')}</Eyebrow>
          </Reveal>
          <TitleWords
            t={t}
            at={0.35}
            words={tr(language, 'socialTitle').split('|')}
            accentIndex={1}
            accent={CYAN}
            className="mt-6 text-[150px] font-bold leading-[1.1] text-white"
          />
          <Reveal t={t} at={1} className="mt-4 text-[38px] text-[#c9ced6]">
            {tr(language, 'socialDesc')}
          </Reveal>
          <Reveal t={t} at={1.4} className="mt-8 text-[32px] font-semibold text-[#19d9ff]">
            <span dir="ltr">@iiZo7al</span>
          </Reveal>
        </div>
      </div>
    </SceneShell>
  )
}

const RANKS = [
  { name: 'VIP', image: '/video/rank-vip.png', tier: 'vip' as const },
  { name: 'VIP+', image: '/video/rank-vipp.png', tier: 'vip' as const },
  { name: 'VIP++', image: '/video/rank-vippp.png', tier: 'vip' as const },
  { name: 'MVP', image: '/video/rank-mvp.png', tier: 'mvp' as const },
  { name: 'MVP+', image: '/video/rank-mvpp.png', tier: 'mvp' as const },
  { name: 'MVP++', image: '/video/rank-mvppp.png', tier: 'mvp' as const },
]

export function StoreScene({ t, duration, language = 'ar' }: SceneProps) {
  return (
    <SceneShell t={t} duration={duration} accent={ORANGE} glowPosition="50% 65%">
      <div className="flex h-full flex-col items-center justify-center px-[150px] text-center">
        <Reveal t={t} at={0.2} className="flex justify-center">
          <Eyebrow accent={ORANGE}>{tr(language, 'storeEyebrow')}</Eyebrow>
        </Reveal>
        <TitleWords
          t={t}
          at={0.35}
          words={tr(language, 'storeTitle').split('|')}
          accentIndex={2}
          accent={ORANGE}
          className="mt-6 text-[100px] font-bold leading-[1.1] text-white"
        />

        <div dir="ltr" className="mt-12 grid grid-cols-3 gap-7">
          {RANKS.map((rank, i) => {
            const p = easeOutBack(progress(t, 0.7 + i * 0.1, 0.85))
            const float = Math.sin(t * 2 + i) * 6
            const isVip = rank.tier === 'vip'
            return (
              <div
                key={rank.name}
                className="flex h-[180px] w-[430px] items-center justify-center rounded-[28px] bg-[#11141b]/80 px-8 py-5 backdrop-blur-sm"
                style={{
                  opacity: Math.min(1, Math.max(0, p)),
                  transform: `translateY(${(1 - p) * 90 + float}px) scale(${Math.max(0, p)})`,
                  border: isVip ? '1px solid rgba(74, 222, 128, 0.25)' : '1px solid rgba(255, 122, 0, 0.25)',
                  boxShadow: isVip
                    ? '0 20px 50px rgba(0,0,0,0.5), 0 0 50px rgba(74, 222, 128, 0.12)'
                    : '0 20px 50px rgba(0,0,0,0.5), 0 0 50px rgba(255, 122, 0, 0.14)',
                }}
              >
                <img
                  src={rank.image}
                  alt={rank.name}
                  className="max-h-[115px] w-auto object-contain"
                  style={{
                    filter: isVip
                      ? 'drop-shadow(0 10px 24px rgba(74, 222, 128, 0.28))'
                      : 'drop-shadow(0 10px 24px rgba(255, 122, 0, 0.28))',
                  }}
                />
              </div>
            )
          })}
        </div>

        <Reveal t={t} at={2.0} className="mt-12 text-[32px] text-[#c9ced6]">
          {tr(language, 'storeDesc')}
        </Reveal>
      </div>
    </SceneShell>
  )
}
