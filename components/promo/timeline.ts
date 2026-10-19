import { FortniteScene, SocialsScene, StoreScene } from './scenes/community-scenes'
import { HeadlineScene, IntroScene } from './scenes/intro-scenes'
import { MinecraftScene, ModpacksScene } from './scenes/minecraft-scenes'
import { OutroScene } from './scenes/outro-scene'
import type { Language, SceneDefinition } from './types'

const sceneLabels: Record<Language, string[]> = {
  ar: ['البداية', 'ابنِ. العب. أبدع.', 'شبكة زحل', 'المودباكات', 'فورتنايت', 'التواصل', 'المتجر', 'الختام'],
  en: ['Intro', 'Build. Play. Create.', 'ZO7AL Network', 'Modpacks', 'Fortnite', 'Community', 'Store', 'Outro'],
  es: ['Inicio', 'Construye. Juega. Crea.', 'Red ZO7AL', 'Modpacks', 'Fortnite', 'Comunidad', 'Tienda', 'Final'],
  fr: ['Intro', 'Construis. Joue. Crée.', 'Réseau ZO7AL', 'Modpacks', 'Fortnite', 'Communauté', 'Boutique', 'Fin'],
  de: ['Intro', 'Bauen. Spielen. Erschaffen.', 'ZO7AL Netzwerk', 'Modpacks', 'Fortnite', 'Community', 'Shop', 'Abspann'],
  pt: ['Início', 'Construa. Jogue. Crie.', 'Rede ZO7AL', 'Modpacks', 'Fortnite', 'Comunidade', 'Loja', 'Final'],
  tr: ['Giriş', 'İnşa et. Oyna. Yarat.', 'ZO7AL Ağı', 'Mod paketleri', 'Fortnite', 'Topluluk', 'Mağaza', 'Kapanış'],
  ja: ['イントロ', '作る。遊ぶ。創造する。', 'ZO7ALネットワーク', 'Modパック', 'Fortnite', 'コミュニティ', 'ストア', 'エンディング'],
  ko: ['인트로', '만들고. 플레이하고. 창조하세요.', 'ZO7AL 네트워크', '모드팩', '포트나이트', '커뮤니티', '스토어', '아웃트로'],
  zh: ['开场', '建造。游玩。创造。', 'ZO7AL 网络', '模组包', 'Fortnite', '社区', '商店', '结尾'],
}

export const SCENES: SceneDefinition[] = [
  { id: 'intro', label: 'البداية', start: 0, duration: 4.5, accent: '#ff7a00', Component: IntroScene },
  { id: 'headline', label: 'ابنِ. العب. أبدع.', start: 4, duration: 5, accent: '#ff7a00', Component: HeadlineScene },
  { id: 'minecraft', label: 'شبكة زحل', start: 8.5, duration: 5, accent: '#ff7a00', Component: MinecraftScene },
  { id: 'modpacks', label: 'المودباكات', start: 13, duration: 4.5, accent: '#2be37b', Component: ModpacksScene },
  { id: 'fortnite', label: 'فورتنايت', start: 17, duration: 5, accent: '#8b5cf6', Component: FortniteScene },
  { id: 'socials', label: 'التواصل', start: 21.5, duration: 4.5, accent: '#19d9ff', Component: SocialsScene },
  { id: 'store', label: 'المتجر', start: 25.5, duration: 4.5, accent: '#ff7a00', Component: StoreScene },
  { id: 'outro', label: 'الختام', start: 29.5, duration: 5.5, accent: '#ff7a00', Component: OutroScene },
]

export const TOTAL_DURATION = 35

export function getScenes(language: Language): SceneDefinition[] {
  return SCENES.map((scene, index) => ({ ...scene, label: sceneLabels[language][index] }))
}
