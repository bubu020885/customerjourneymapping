import type { ProjectSettings } from './types'

export const CANVAS_W = 1920
export const CANVAS_H = 1080
export const LABEL_COL_W = 210
export const HEADER_H = 108

export const PHASE_HEADER_WEIGHT_WITH_IMAGE = 1.7
export const PHASE_HEADER_WEIGHT_NO_IMAGE = 0.85

export const DATA_ROWS = [
  { key: 'goals', label: 'Ziele & Bedürfnisse', weight: 1 },
  { key: 'touchpoints', label: 'Touchpoints', weight: 1 },
  { key: 'emotion', label: 'Emotionen', weight: 0.9 },
  { key: 'score', label: 'Erlebnis (Score)', weight: 0.8 },
  { key: 'painPoints', label: 'Pain Points', weight: 1.3 },
  { key: 'opportunities', label: 'Opportunities', weight: 1.3 },
  { key: 'recommendations', label: 'Handlungsempfehlungen', weight: 1 },
] as const

export type RowKey = (typeof DATA_ROWS)[number]['key']

export interface RowBand {
  key: string
  label: string
  top: number
  height: number
}

export function computeRowBands(project: ProjectSettings): { header: number; footer: number; rowsAreaTop: number; rowsAreaHeight: number; phaseHeaderBand: RowBand; dataBands: RowBand[] } {
  const footer = project.showKpi || project.showSummary ? project.kpiHeight : 0
  const rowsAreaTop = HEADER_H
  const rowsAreaHeight = CANVAS_H - HEADER_H - footer

  const rowMult = project.rowHeight || 1
  const phaseHeaderWeight = project.showPhaseImages !== false ? PHASE_HEADER_WEIGHT_WITH_IMAGE : PHASE_HEADER_WEIGHT_NO_IMAGE
  const totalWeight = phaseHeaderWeight + DATA_ROWS.reduce((s, r) => s + r.weight * rowMult, 0)

  let cursor = rowsAreaTop
  const phaseHeaderHeight = (rowsAreaHeight * phaseHeaderWeight) / totalWeight
  const phaseHeaderBand: RowBand = { key: 'phaseHeader', label: 'Phasen', top: cursor, height: phaseHeaderHeight }
  cursor += phaseHeaderHeight

  const dataBands: RowBand[] = DATA_ROWS.map((r) => {
    const h = (rowsAreaHeight * (r.weight * rowMult)) / totalWeight
    const band: RowBand = { key: r.key, label: r.label, top: cursor, height: h }
    cursor += h
    return band
  })

  return { header: HEADER_H, footer, rowsAreaTop, rowsAreaHeight, phaseHeaderBand, dataBands }
}

export function getPhaseCenterX(columnGap: number, phaseCount: number, index: number): number {
  const totalWidth = CANVAS_W - LABEL_COL_W
  if (phaseCount <= 0) return LABEL_COL_W
  const itemWidth = (totalWidth - columnGap * (phaseCount - 1)) / phaseCount
  return LABEL_COL_W + columnGap * index + itemWidth * (index + 0.5)
}
