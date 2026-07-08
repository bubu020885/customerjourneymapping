export type Emotion = 'sehr positiv' | 'positiv' | 'neutral' | 'negativ' | 'kritisch'

export const EMOTION_META: Record<Emotion, { emoji: string; color: string; label: string }> = {
  'sehr positiv': { emoji: '😄', color: '#1f9d55', label: 'Sehr positiv' },
  positiv: { emoji: '🙂', color: '#4caf50', label: 'Positiv' },
  neutral: { emoji: '😐', color: '#f2b705', label: 'Neutral' },
  negativ: { emoji: '☹️', color: '#f2761f', label: 'Negativ' },
  kritisch: { emoji: '😡', color: '#d92b2b', label: 'Kritisch' },
}

export const EMOTION_ORDER: Emotion[] = ['kritisch', 'negativ', 'neutral', 'positiv', 'sehr positiv']

export interface Phase {
  id: string
  number: number
  title: string
  subtitle: string
  image: string
  color: string
  accent: string
  textColor: string
  description: string
  goals: string[]
  touchpoints: string[]
  emotion: Emotion
  score: number
  painPoints: string[]
  opportunities: string[]
  recommendations: string[]
}

export interface ProjectColors {
  primary: string
  secondary: string
  accent: string
  background: string
}

export interface ProjectSettings {
  title: string
  subtitle: string
  client: string
  persona: string
  logo: string
  colors: ProjectColors
  fontSize: number
  cardRadius: number
  columnGap: number
  rowHeight: number
  showLegend: boolean
  showKpi: boolean
  showSummary: boolean
}

export interface KpiData {
  insightTitle: string
  insightText: string
  guestEffortScore: number
  topPainPoints: string[]
  topStrengths: string[]
  topLevers: string[]
}

export interface JourneyMapData {
  project: ProjectSettings
  phases: Phase[]
  kpi: KpiData
}

export const ROW_LABELS = [
  { key: 'goals', label: 'Ziele & Bedürfnisse', icon: 'target' },
  { key: 'touchpoints', label: 'Touchpoints', icon: 'contact' },
  { key: 'emotion', label: 'Emotionen', icon: 'heart' },
  { key: 'score', label: 'Erlebnis / Score', icon: 'star' },
  { key: 'painPoints', label: 'Pain Points', icon: 'alert' },
  { key: 'opportunities', label: 'Opportunities', icon: 'rocket' },
  { key: 'recommendations', label: 'Handlungsempfehlungen', icon: 'check' },
] as const
