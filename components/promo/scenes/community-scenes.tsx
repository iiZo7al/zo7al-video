import { Crown, ShieldCheck, Sparkles, Zap } from 'lucide-react'
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
  { code: '6387-4453-1682', title: 'حرب الكلانات' },
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

type RankConfig = {
  name: string
  image: string
  tier: string
  badge: string
  accent: string
  border: string
  glow: string
  bgGlow: string
  tagColor: string
  tagBg: string
  special?: 'crown' | 'sparkle'
}

const RANKS: RankConfig[] = [
  {
    name: 'VIP',
    image: '/video/rank-vip.png',
    tier: 'VIP TIER',
    badge: 'TIER I',
    accent: '#4ade80',
    border: 'rgba(74, 222, 128, 0.35)',
    glow: 'rgba(74, 222, 128, 0.22)',
    bgGlow: 'rgba(74, 222, 128, 0.16)',
    tagColor: 'text-[#4ade80]',
    tagBg: 'bg-[#4ade80]/15 border-[#4ade80]/30',
  },
  {
    name: 'VIP+',
    image: '/video/rank-vipp.png',
    tier: 'VIP TIER',
    badge: 'TIER II',
    accent: '#22c55e',
    border: 'rgba(34, 197, 94, 0.4)',
    glow: 'rgba(34, 197, 94, 0.26)',
    bgGlow: 'rgba(34, 197, 94, 0.18)',
    tagColor: 'text-[#86efac]',
    tagBg: 'bg-[#22c55e]/15 border-[#22c55e]/30',
  },
  {
    name: 'VIP++',
    image: '/video/rank-vippp.png',
    tier: 'VIP TIER',
    badge: 'VIP ELITE',
    accent: '#10b981',
    border: 'rgba(16, 185, 129, 0.55)',
    glow: 'rgba(16, 185, 129, 0.35)',
    bgGlow: 'rgba(16, 185, 129, 0.22)',
    tagColor: 'text-[#6ee7b7]',
    tagBg: 'bg-[#10b981]/20 border-[#10b981]/40',
    special: 'sparkle',
  },
  {
    name: 'MVP',
    image: '/video/rank-mvp.png',
    tier: 'MVP PRESTIGE',
    badge: 'PRESTIGE',
    accent: '#fbbf24',
    border: 'rgba(251, 191, 36, 0.4)',
    glow: 'rgba(251, 191, 36, 0.26)',
    bgGlow: 'rgba(251, 191, 36, 0.18)',
    tagColor: 'text-[#fbbf24]',
    tagBg: 'bg-[#fbbf24]/15 border-[#fbbf24]/30',
  },
  {
    name: 'MVP+',
    image: '/video/rank-mvpp.png',
    tier: 'MVP PRESTIGE',
    badge: 'HEROIC',
    accent: '#f59e0b',
    border: 'rgba(245, 158, 11, 0.45)',
    glow: 'rgba(245, 158, 11, 0.3)',
    bgGlow: 'rgba(245, 158, 11, 0.22)',
    tagColor: 'text-[#fcd34d]',
    tagBg: 'bg-[#f59e0b]/15 border-[#f59e0b]/30',
  },
  {
    name: 'MVP++',
    image: '/video/rank-mvppp.png',
    tier: 'MVP PRESTIGE',
    badge: 'ULTIMATE',
    accent: '#ff7a00',
    border: 'rgba(255, 122, 0, 0.65)',
    glow: 'rgba(255, 122, 0, 0.42)',
    bgGlow: 'rgba(255, 122, 0, 0.28)',
    tagColor: 'text-[#fed7aa]',
    tagBg: 'bg-[#ff7a00]/25 border-[#ff7a00]/50',
    special: 'crown',
  },
]

export function StoreScene({ t, duration, language = 'ar' }: SceneProps) {
  return (
    <SceneShell t={t} duration={duration} accent={ORANGE} glowPosition="50% 65%">
      <div className="flex h-full flex-col items-center justify-center px-[120px] text-center">
        <Reveal t={t} at={0.15}>
          <Eyebrow accent={ORANGE}>{tr(language, 'storeEyebrow')}</Eyebrow>
        </Reveal>
        <TitleWords
          t={t}
          at={0.3}
          words={tr(language, 'storeTitle').split('|')}
          accentIndex={2}
          accent={ORANGE}
          className="mt-4 text-[92px] font-black leading-[1.05] tracking-tight text-white"
        />

        <div dir="ltr" className="mt-7 grid grid-cols-3 gap-6">
          {RANKS.map((rank, i) => {
            const p = easeOutBack(progress(t, 0.6 + i * 0.1, 0.8))
            const float = Math.sin(t * 2.4 + i * 1.05) * 5
            return (
              <div
                key={rank.name}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[26px] border bg-[#0d1017]/95 p-4 text-left"
                style={{
                  width: '460px',
                  height: '185px',
                  opacity: Math.min(1, Math.max(0, p)),
                  transform: `perspective(1000px) translateY(${(1 - p) * 90 + float}px) scale(${Math.max(0, p)})`,
                  borderColor: rank.border,
                  background: `radial-gradient(120% 120% at 50% 20%, ${rank.bgGlow}, #0a0d13 80%)`,
                  boxShadow: `0 20px 45px rgba(0,0,0,0.6), 0 0 50px ${rank.glow}`,
                }}
              >
                {/* Backlight Glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[40px]"
                  style={{
                    width: '260px',
                    height: '100px',
                    background: rank.accent,
                    opacity: 0.16 + Math.sin(t * 3 + i) * 0.05,
                  }}
                />

                {/* Header row */}
                <div className="relative z-10 flex items-center justify-between px-2 pt-0.5">
                  <div className="flex items-center gap-2 font-mono text-[16px] font-semibold tracking-wider text-[#94a3b8]">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: rank.accent, boxShadow: `0 0 10px ${rank.accent}` }}
                    />
                    {rank.tier}
                  </div>
                  <div
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[14px] font-bold uppercase tracking-wider ${rank.tagBg} ${rank.tagColor}`}
                  >
                    {rank.special === 'crown' && <Crown className="h-3.5 w-3.5 text-[#fbbf24]" />}
                    {rank.special === 'sparkle' && <Sparkles className="h-3.5 w-3.5 text-[#34d399]" />}
                    {rank.badge}
                  </div>
                </div>

                {/* Centered 3D Rank Badge */}
                <div className="relative z-10 flex flex-1 items-center justify-center py-1">
                  <img
                    src={rank.image}
                    alt={rank.name}
                    className="max-h-[105px] w-auto object-contain"
                    style={{
                      filter: `drop-shadow(0 10px 22px ${rank.glow})`,
                      transform: `scale(${1 + Math.sin(t * 2.8 + i) * 0.02})`,
                    }}
                  />
                </div>

                {/* Subtle bottom shine line */}
                <div
                  aria-hidden="true"
                  className="relative z-10 h-[2px] w-full rounded-full opacity-35"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${rank.accent}, transparent)`,
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* Tebex Official Store Trust Banner */}
        <Reveal t={t} at={1.8} y={24} className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-5 rounded-full border border-white/10 bg-[#0e1219]/90 px-8 py-3.5 shadow-[0_16px_50px_rgba(0,0,0,0.6)] backdrop-blur-md">
            <div className="flex items-center gap-2 rounded-full border border-[#2be37b]/30 bg-[#2be37b]/15 px-4 py-1.5 text-[18px] font-bold text-[#2be37b]">
              <ShieldCheck className="h-5 w-5 text-[#2be37b]" />
              <span>TEBEX VERIFIED</span>
            </div>
            <span className="text-[25px] font-medium text-[#e2e8f0]">
              {tr(language, 'storeDesc')}
            </span>
            <div className="flex items-center gap-2 rounded-full border border-[#ff7a00]/30 bg-[#ff7a00]/15 px-4 py-1.5 text-[18px] font-semibold text-[#ffaa40]">
              <Zap className="h-4 w-4 text-[#ff7a00]" />
              <span>INSTANT ACCESS</span>
            </div>
          </div>
        </Reveal>
      </div>
    </SceneShell>
  )
}
