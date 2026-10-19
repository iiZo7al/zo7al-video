import type { ComponentType } from 'react'

export type SceneProps = {
  t: number
  duration: number
  language?: Language
}

export type Language = 'ar' | 'en' | 'es' | 'fr' | 'de' | 'pt' | 'tr' | 'ja' | 'ko' | 'zh'

export type SceneDefinition = {
  id: string
  label: string
  start: number
  duration: number
  accent: string
  Component: ComponentType<SceneProps>
}
