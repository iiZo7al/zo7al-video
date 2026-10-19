import { FortniteScene, SocialsScene, StoreScene } from './scenes/community-scenes'
import { IntroScene } from './scenes/intro-scenes'
import { MinecraftScene, ModpacksScene } from './scenes/minecraft-scenes'
import { OutroScene } from './scenes/outro-scene'
import type { Language, SceneDefinition } from './types'

const sceneLabels: Record<Language, string[]> = {
  ar: ['البداية', 'شبكة زحل', 'المودباكات', 'فورتنايت', 'التواصل', 'المتجر', 'الختام'],
  en: ['Intro', 'ZO7AL Network', 'Modpacks', 'Fortnite', 'Community', 'Store', 'Outro'],
  es: ['Inicio', 'Red ZO7AL', 'Modpacks', 'Fortnite', 'Comunidad', 'Tienda', 'Final'],
  fr: ['Intro', 'Réseau ZO7AL', 'Modpacks', 'Fortnite', 'Communauté', 'Boutique', 'Fin'],
  de: ['Intro', 'ZO7AL Netzwerk', 'Modpacks', 'Fortnite', 'Community', 'Shop', 'Abspann'],
  pt: ['Início', 'Rede ZO7AL', 'Modpacks', 'Fortnite', 'Comunidade', 'Loja', 'Final'],
  tr: ['Giriş', 'ZO7AL Ağı', 'Mod paketleri', 'Fortnite', 'Topluluk', 'Mağaza', 'Kapanış'],
  ja: ['イントロ', 'ZO7ALネットワーク', 'Modパック', 'Fortnite', 'コミュニティ', 'ストア', 'エンディング'],
  ko: ['인트로', 'ZO7AL 네트워크', '모드팩', '포트나이트', '커뮤니티', '스토어', '아웃트로'],
  zh: ['开场', 'ZO7AL 网络', '模组包', 'Fortnite', '社区', '商店', '结尾'],
}

export const SCENES: SceneDefinition[] = [
  { id: 'intro', label: 'البداية', start: 0, duration: 4.5, accent: '#ff7a00', Component: IntroScene },
  { id: 'minecraft', label: 'شبكة زحل', start: 4, duration: 5, accent: '#ff7a00', Component: MinecraftScene },
  { id: 'modpacks', label: 'المودباكات', start: 8.5, duration: 4.5, accent: '#2be37b', Component: ModpacksScene },
  { id: 'fortnite', label: 'فورتنايت', start: 12.5, duration: 5, accent: '#8b5cf6', Component: FortniteScene },
  { id: 'socials', label: 'التواصل', start: 17, duration: 4.5, accent: '#19d9ff', Component: SocialsScene },
  { id: 'store', label: 'المتجر', start: 21, duration: 4.5, accent: '#ff7a00', Component: StoreScene },
  { id: 'outro', label: 'الختام', start: 25, duration: 5, accent: '#ff7a00', Component: OutroScene },
]

export const TOTAL_DURATION = 30

export function getScenes(language: Language): SceneDefinition[] {
  return SCENES.map((scene, index) => ({ ...scene, label: sceneLabels[language][index] }))
}
