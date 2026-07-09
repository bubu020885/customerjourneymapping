import type { Phase, ProjectSettings } from '../types'
import { EMOTION_META, EMOTION_ORDER } from '../types'
import { CANVAS_W, computeRowBands, getPhaseCenterX } from '../layoutConstants'

export function EmotionCurve({ phases, project }: { phases: Phase[]; project: ProjectSettings }) {
  if (phases.length === 0) return null
  const bands = computeRowBands(project)
  const band = bands.dataBands[2] // emotion row
  const localTop = band.top - bands.rowsAreaTop
  const top = localTop + 10
  const bottom = localTop + band.height * 0.52

  const points = phases.map((p, i) => {
    const idx = EMOTION_ORDER.indexOf(p.emotion)
    const frac = idx / (EMOTION_ORDER.length - 1) // 0 = kritisch, 1 = sehr positiv
    const y = bottom - frac * (bottom - top)
    const x = getPhaseCenterX(project.columnGap, phases.length, i)
    return { x, y, color: EMOTION_META[p.emotion].color }
  })

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={CANVAS_W}
      height={bands.rowsAreaHeight}
      viewBox={`0 0 ${CANVAS_W} ${bands.rowsAreaHeight}`}
      style={{ zIndex: 1 }}
    >
      <path d={path} fill="none" stroke={project.colors.secondary} strokeWidth={2.5} strokeDasharray="7 6" opacity={0.85} />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={5} fill={p.color} stroke="white" strokeWidth={1.5} />
      ))}
    </svg>
  )
}
