export type Emotion =
  | 'verzaubert'
  | 'sehr positiv'
  | 'positiv'
  | 'überrascht'
  | 'neutral'
  | 'verwirrt'
  | 'negativ'
  | 'verärgert'
  | 'kritisch'

export const EMOTION_META: Record<Emotion, { emoji: string; color: string; label: string }> = {
  verzaubert: { emoji: '🤩', color: '#0d9488', label: 'Verzaubert' },
  'sehr positiv': { emoji: '😄', color: '#1f9d55', label: 'Sehr positiv' },
  positiv: { emoji: '🙂', color: '#4caf50', label: 'Positiv' },
  überrascht: { emoji: '😮', color: '#a3c925', label: 'Überrascht' },
  neutral: { emoji: '😐', color: '#f2b705', label: 'Neutral' },
  verwirrt: { emoji: '😕', color: '#f0951a', label: 'Verwirrt' },
  negativ: { emoji: '☹️', color: '#f2761f', label: 'Negativ' },
  verärgert: { emoji: '😠', color: '#e2531f', label: 'Verärgert' },
  kritisch: { emoji: '😡', color: '#d92b2b', label: 'Kritisch' },
}

/** Worst to best, used for consistent ordering (dropdown, any future scales). */
export const EMOTION_ORDER: Emotion[] = [
  'kritisch',
  'verärgert',
  'negativ',
  'verwirrt',
  'neutral',
  'überrascht',
  'positiv',
  'sehr positiv',
  'verzaubert',
]

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
  /** Text color for goals/touchpoints list entries. Falls back to a dark neutral if unset. */
  bodyTextColor?: string
  /** Text color for pain point entries. Falls back to red if unset. */
  painPointColor?: string
  /** Text color for opportunity entries. Falls back to green if unset. */
  opportunityColor?: string
  /** Text color for recommendation entries. Falls back to the project secondary color if unset. */
  recommendationColor?: string
  /** Up to 3 photos shown for this phase in the Präsentationsmodus (separate from the header image). */
  photos?: string[]
}

export const MAX_PRESENTATION_PHOTOS = 4

export const DEFAULT_BODY_TEXT_COLOR = '#1f2937'
export const DEFAULT_PAIN_POINT_COLOR = '#c0272d'
export const DEFAULT_OPPORTUNITY_COLOR = '#1f9d55'

export interface ProjectColors {
  primary: string
  secondary: string
  accent: string
  background: string
  /** Text color for the row labels in the dark sidebar (Phasen, Ziele & Bedürfnisse, ...). */
  sidebarText?: string
}

export const DEFAULT_SIDEBAR_TEXT_COLOR = '#ffffff'

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
  showKpi: boolean
  showSummary: boolean
  showPhaseImages: boolean
  /** Height in px of the bottom KPI/summary band on the canvas. */
  kpiHeight: number
}

export const DEFAULT_KPI_HEIGHT = 260

export interface KpiData {
  insightTitle: string
  insightText: string
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
