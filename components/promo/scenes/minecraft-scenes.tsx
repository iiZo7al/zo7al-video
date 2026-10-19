import { siCurseforge, siModrinth } from 'simple-icons'
import { easeOutBack, easeOutExpo, progress } from '@/lib/motion'
import { BrandIcon } from '../brand-icon'
import { Eyebrow, Reveal, SceneShell, TitleWords } from '../primitives'
import type { SceneProps } from '../types'

const ORANGE = '#ff7a00'
const GREEN = '#2be37b'
const ADDRESS = 'zo7al.play-mc.fun'

export function MinecraftScene({ t, duration }: SceneProps) {
  const typed = Math.floor(progress(t, 1.3, 1.3) * ADDRESS.length)
  const caretVisible = Math.floor(t * 2.5) % 2 === 0
  const card = easeOutExpo(progress(t, 0.6, 1))
  const logo = easeOutBack(progress(t, 0.9, 0.9))
  const pulse = (t * 0.9) % 1

  return (
    <SceneShell t={t} duration={duration} accent={ORANGE} glowPosition="25% 50%">
      <div className="flex h-full items-center justify-between px-[150px]">
        <div className="max-w-[760px]">
          <Reveal t={t} at={0.2}>
            <Eyebrow accent={ORANGE}>ماينكرافت · جافا + بيدروك</Eyebrow>
          </Reveal>
          <TitleWords
            t={t}
            at={0.35}
            words={['شبكة', 'زحل']}
            accentIndex={1}
            accent={ORANGE}
            className="mt-8 text-[150px] font-bold leading-[1.05] text-white"
          />
          <Reveal t={t} at={0.9} className="mt-8 text-[40px] leading-relaxed text-[#c9ced6]">
            مغامرتك القادمة في ماينكرافت تبدأ من هنا.
          </Reveal>
          <div className="mt-12 flex gap-4" dir="ltr">
            {['1.8.9', '1.20.x', '1.21.x'].map((version, i) => (
              <Reveal
                key={version}
                t={t}
                at={2.6 + i * 0.12}
                y={20}
                className="rounded-full border border-white/15 bg-white/5 px-7 py-3 font-mono text-[26px] text-white"
              >
                {version}
              </Reveal>
            ))}
          </div>
        </div>

        <div
          className="relative w-[720px] rounded-[36px] border border-white/10 bg-[#11141b]/90 p-12"
          style={{
            opacity: card,
            transform: `perspective(1600px) rotateY(${(1 - card) * 18}deg) translateX(${(1 - card) * -80}px)`,
            boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 80px rgba(255,122,0,0.12)',
          }}
        >
          <div className="flex items-center justify-between">
            <img
              src="/video/server-logo.png"
              alt="شعار شبكة زحل"
              width={150}
              height={150}
              style={{ transform: `scale(${logo}) rotate(${(1 - logo) * -20}deg)` }}
            />
            <div className="flex items-center gap-4 rounded-full border border-[#2be37b]/30 bg-[#2be37b]/10 px-6 py-3 text-[26px] font-semibold text-[#2be37b]">
              <span className="relative flex h-4 w-4">
                <span
                  className="absolute inset-0 rounded-full bg-[#2be37b]"
                  style={{ transform: `scale(${1 + pulse * 1.6})`, opacity: 1 - pulse }}
                />
                <span className="relative h-4 w-4 rounded-full bg-[#2be37b]" />
              </span>
              جاهزة للعب
            </div>
          </div>

          <div className="mt-10 text-[24px] text-[#8f96a3]">جافا وبيدروك · IP</div>
          <div
            dir="ltr"
            className="mt-3 rounded-2xl border border-white/10 bg-black/40 px-7 py-6 text-left text-[46px] text-white"
            style={{ fontFamily: 'Monocraft, monospace' }}
          >
            {ADDRESS.slice(0, typed)}
            <span className="text-[#ff7a00]" style={{ opacity: caretVisible ? 1 : 0 }}>
              _
            </span>
          </div>

          <Reveal t={t} at={2.7} y={20} className="mt-8 flex items-center justify-between rounded-2xl bg-white/5 px-7 py-5">
            <span className="text-[26px] text-[#8f96a3]">منفذ Bedrock</span>
            <span dir="ltr" className="text-[34px] text-white" style={{ fontFamily: 'Monocraft, monospace' }}>
              25807
            </span>
          </Reveal>
        </div>
      </div>
    </SceneShell>
  )
}

const PLATFORMS = [
  { icon: siModrinth, name: 'Modrinth', label: 'مباشر من Modrinth', color: '#00af5c' },
  { icon: siCurseforge, name: 'CurseForge', label: 'مباشر من CURSEFORGE', color: '#f16436' },
]

export function ModpacksScene({ t, duration }: SceneProps) {
  return (
    <SceneShell t={t} duration={duration} accent={GREEN} glowPosition="50% 70%">
      <div className="flex h-full flex-col items-center justify-center px-[150px] text-center">
        <Reveal t={t} at={0.2}>
          <Eyebrow accent={GREEN}>المودباكات</Eyebrow>
        </Reveal>
        <TitleWords
          t={t}
          at={0.35}
          words={['ماينكرافت،', 'بحلّة', 'جديدة.']}
          accentIndex={2}
          accent={GREEN}
          className="mt-8 text-[130px] font-bold leading-[1.1] text-white"
        />
        <div className="mt-16 flex gap-10">
          {PLATFORMS.map((platform, i) => {
            const p = easeOutBack(progress(t, 1.2 + i * 0.2, 0.9))
            return (
              <div
                key={platform.name}
                className="flex w-[560px] items-center gap-8 rounded-[32px] border border-white/10 bg-[#11141b]/90 p-10 text-start"
                style={{
                  opacity: Math.min(1, p),
                  transform: `translateY(${(1 - p) * 120}px)`,
                  boxShadow: `0 0 80px color-mix(in srgb, ${platform.color} 22%, transparent)`,
                }}
              >
                <div
                  className="flex h-[110px] w-[110px] shrink-0 items-center justify-center rounded-3xl"
                  style={{ background: `color-mix(in srgb, ${platform.color} 16%, transparent)` }}
                >
                  <BrandIcon icon={platform.icon} size={64} />
                </div>
                <div>
                  <div dir="ltr" className="text-start text-[48px] font-bold text-white">
                    {platform.name}
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-[22px] font-semibold text-[#2be37b]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#2be37b]" />
                    {platform.label}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <Reveal t={t} at={2.1} className="mt-14 text-[34px] text-[#c9ced6]">
          تحديثات المودباكات من Modrinth وCurseForge، كلها في مكان واحد.
        </Reveal>
      </div>
    </SceneShell>
  )
}
