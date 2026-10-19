'use client'

import { useState } from 'react'
import { PromoPlayer } from '@/components/promo/promo-player'

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'pt', name: 'Português', flag: '🇧🇷', dir: 'ltr' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ko', name: '한국어', flag: '🇰🇷', dir: 'ltr' },
  { code: 'zh', name: '中文', flag: '🇨🇳', dir: 'ltr' },
] as const

const copy = {
  ar: { title: 'فيديو تعريفي لموقع', description: 'جولة سينمائية خلال ٣٥ ثانية في عالم زحل: شبكة ماينكرافت، المودباكات، مابات فورتنايت، التواصل والمتجر.' },
  en: { title: 'Introducing the', description: 'A 35-second cinematic tour of ZO7AL: Minecraft, modpacks, Fortnite maps, community, and store.' },
  es: { title: 'Conoce', description: 'Un recorrido cinematográfico de 35 segundos por ZO7AL: Minecraft, modpacks, mapas de Fortnite, comunidad y tienda.' },
  fr: { title: 'Découvrez', description: 'Une visite cinématographique de 35 secondes de ZO7AL : Minecraft, modpacks, cartes Fortnite, communauté et boutique.' },
  de: { title: 'Lerne kennen:', description: 'Eine filmische 35-Sekunden-Tour durch ZO7AL: Minecraft, Modpacks, Fortnite-Karten, Community und Shop.' },
  pt: { title: 'Conheça', description: 'Um tour cinematográfico de 35 segundos pelo ZO7AL: Minecraft, modpacks, mapas de Fortnite, comunidade e loja.' },
  tr: { title: 'Tanıtım videosu:', description: 'ZO7AL dünyasında 35 saniyelik sinematik bir tur: Minecraft, mod paketleri, Fortnite haritaları, topluluk ve mağaza.' },
  ja: { title: 'ZO7ALの紹介', description: 'Minecraft、Modパック、Fortniteマップ、コミュニティ、ショップを巡る35秒のシネマティックツアー。' },
  ko: { title: 'ZO7AL 소개 영상', description: '마인크래프트, 모드팩, 포트나이트 맵, 커뮤니티와 스토어를 둘러보는 35초 시네마틱 투어.' },
  zh: { title: 'ZO7AL 网站介绍', description: '用 35 秒电影感旅程探索 ZO7AL：Minecraft、模组包、Fortnite 地图、社区和商店。' },
} as const

export default function Page() {
  const [language, setLanguage] = useState<(typeof languages)[number]['code']>('ar')
  const selected = languages.find((item) => item.code === language)!
  const text = copy[language]
  return (
    <main dir={selected.dir} lang={language} className="min-h-screen bg-[#07080b] px-4 py-10 text-white md:px-8 md:py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-3">
          <div className="flex justify-end">
            <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#11141b] px-3 py-2 text-sm text-[#c4c8d0]">
              <span aria-hidden="true">{selected.flag}</span>
              <span className="sr-only">Language</span>
              <select aria-label="Language" value={language} onChange={(event) => setLanguage(event.target.value as typeof language)} className="cursor-pointer bg-transparent text-white outline-none">
                {languages.map((item) => <option className="bg-[#11141b]" key={item.code} value={item.code}>{item.name}</option>)}
              </select>
            </label>
          </div>
          <p className="flex items-center gap-3 text-sm font-semibold text-[#8f96a3]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff7a00]" />
            <span dir="ltr">@iiZo7al</span>
          </p>
          <h1 className="text-balance text-4xl font-bold md:text-5xl">
            {text.title} <span dir="ltr">ZO<span className="text-[#ff7a00]">7</span>AL</span>
          </h1>
          <p className="text-pretty text-lg leading-relaxed text-[#8f96a3]">{text.description}</p>
        </header>
        <PromoPlayer language={language} />
      </div>
    </main>
  )
}
