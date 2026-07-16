import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Image as ImageIcon, X } from 'lucide-react'
import type { Phase, ProjectSettings } from '../types'
import { EMOTION_META, DEFAULT_BODY_TEXT_COLOR, DEFAULT_PAIN_POINT_COLOR, DEFAULT_OPPORTUNITY_COLOR } from '../types'
import { computeRowBands } from '../layoutConstants'

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const int = parseInt(full, 16)
  if (Number.isNaN(int) || full.length !== 6) return `rgba(0, 0, 0, ${alpha})`
  const r = (int >> 16) & 255
  const g = (int >> 8) & 255
  const b = int & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function List({ items, fontSize, color, bullet }: { items: string[]; fontSize: number; color?: string; bullet?: string }) {
  return (
    <ul className="space-y-0.5 leading-tight w-full" style={{ fontSize: fontSize * 0.72 }}>
      {items.filter(Boolean).map((item, i) => (
        <li key={i} className="flex gap-1 items-start" style={{ color: color ?? 'inherit' }}>
          <span className="shrink-0" style={{ color: color ?? '#94a3b8' }}>
            {bullet ?? '•'}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function PhaseColumn({
  phase,
  project,
  selected,
  onSelect,
  onDelete,
  editable,
}: {
  phase: Phase
  project: ProjectSettings
  selected: boolean
  onSelect: () => void
  onDelete: () => void
  editable: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: phase.id })
  const rawBands = computeRowBands(project)
  const offset = rawBands.rowsAreaTop
  const bands = {
    phaseHeaderBand: { ...rawBands.phaseHeaderBand, top: rawBands.phaseHeaderBand.top - offset },
    dataBands: rawBands.dataBands.map((b) => ({ ...b, top: b.top - offset })),
  }
  const radius = project.cardRadius

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  }

  const emo = EMOTION_META[phase.emotion]

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className="relative flex-1 min-w-0 h-full cursor-pointer group"
    >
      {selected && editable && (
        <div className="absolute inset-0 pointer-events-none border-2 rounded-md z-20" style={{ borderColor: project.colors.accent }} />
      )}

      {/* Phase header band */}
      <div
        className="absolute left-0 right-0 flex flex-col overflow-hidden"
        style={{
          top: bands.phaseHeaderBand.top,
          height: bands.phaseHeaderBand.height,
          background: phase.color,
          color: phase.textColor,
          borderRadius: radius,
          margin: '0 4px',
        }}
      >
        <div className="flex items-center gap-1.5 px-2 pt-1.5 pr-6">
          <span
            className="flex items-center justify-center rounded-full font-bold shrink-0"
            style={{
              width: project.fontSize * 1.6,
              height: project.fontSize * 1.6,
              background: project.colors.accent,
              color: project.colors.primary,
              fontSize: project.fontSize * 0.85,
            }}
          >
            {phase.number}
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-extrabold truncate leading-tight" style={{ fontSize: project.fontSize * 0.95 }}>
              {phase.title}
            </div>
            <div className="opacity-80 truncate" style={{ fontSize: project.fontSize * 0.68 }}>
              {phase.subtitle}
            </div>
          </div>
        </div>
        {project.showPhaseImages !== false && (
          <div className="flex-1 min-h-0 mx-1.5 mb-1.5 mt-1 rounded overflow-hidden bg-black/10">
            {phase.image ? (
              <img src={phase.image} alt={phase.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-50">
                <ImageIcon size={28} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Corner overlay controls: positioned relative to the column itself so they are
          never squeezed out or clipped by the header's own overflow-hidden when many
          columns make the column narrow. */}
      {editable && (
        <>
          <button
            {...attributes}
            {...listeners}
            data-pan-ignore
            onClick={(e) => e.stopPropagation()}
            className="absolute z-30 left-1 flex items-center justify-center rounded opacity-0 group-hover:opacity-80 hover:!opacity-100 text-white bg-black/25 cursor-grab active:cursor-grabbing"
            style={{ top: bands.phaseHeaderBand.top + 2, width: 20, height: 20 }}
            title="Verschieben"
          >
            <GripVertical size={13} />
          </button>
          <button
            data-pan-ignore
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="absolute z-30 right-1 flex items-center justify-center rounded opacity-0 group-hover:opacity-80 hover:!opacity-100 text-white bg-black/25"
            style={{ top: bands.phaseHeaderBand.top + 2, width: 20, height: 20 }}
            title="Phase löschen"
          >
            <X size={13} />
          </button>
        </>
      )}

      {/* Goals */}
      <Cell band={bands.dataBands[0]} tint={phase.color}>
        <List items={phase.goals} fontSize={project.fontSize} color={phase.bodyTextColor ?? DEFAULT_BODY_TEXT_COLOR} />
      </Cell>

      {/* Touchpoints */}
      <Cell band={bands.dataBands[1]} tint={phase.color}>
        <List items={phase.touchpoints} fontSize={project.fontSize} color={phase.bodyTextColor ?? DEFAULT_BODY_TEXT_COLOR} />
      </Cell>

      {/* Emotion */}
      <Cell band={bands.dataBands[2]} center>
        <div className="flex flex-col items-center gap-0.5">
          <span style={{ fontSize: project.fontSize * 1.6 }}>{emo.emoji}</span>
          <span className="font-semibold text-center" style={{ fontSize: project.fontSize * 0.7, color: emo.color }}>
            {emo.label}
          </span>
        </div>
      </Cell>

      {/* Score */}
      <Cell band={bands.dataBands[3]} center>
        <ScoreStars score={phase.score} fontSize={project.fontSize} accent={project.colors.accent} />
      </Cell>

      {/* Pain points */}
      <Cell band={bands.dataBands[4]} tint={phase.color}>
        <List items={phase.painPoints} fontSize={project.fontSize} color={phase.painPointColor ?? DEFAULT_PAIN_POINT_COLOR} bullet="✕" />
      </Cell>

      {/* Opportunities */}
      <Cell band={bands.dataBands[5]} tint={phase.color}>
        <List items={phase.opportunities} fontSize={project.fontSize} color={phase.opportunityColor ?? DEFAULT_OPPORTUNITY_COLOR} bullet="✓" />
      </Cell>

      {/* Recommendations */}
      <Cell band={bands.dataBands[6]} tint={phase.color}>
        <List
          items={phase.recommendations}
          fontSize={project.fontSize}
          color={phase.recommendationColor ?? project.colors.secondary}
          bullet="→"
        />
      </Cell>
    </div>
  )
}

function Cell({
  band,
  children,
  center,
  tint,
}: {
  band: { top: number; height: number }
  children: React.ReactNode
  center?: boolean
  tint?: string
}) {
  return (
    <div
      className={`absolute left-0 right-0 px-2.5 py-1.5 overflow-hidden border-b ${center ? 'flex items-center justify-center' : ''}`}
      style={{
        top: band.top,
        height: band.height,
        borderColor: '#e5e7eb',
        margin: '0 4px',
        background: tint ? hexToRgba(tint, 0.08) : undefined,
      }}
    >
      {children}
    </div>
  )
}

function ScoreStars({ score, fontSize, accent }: { score: number; fontSize: number; accent: string }) {
  const stars = Math.round((score / 10) * 5 * 2) / 2
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div style={{ fontSize: fontSize * 1.05, letterSpacing: 1, color: accent }}>
        {'★'.repeat(Math.floor(stars))}
        {stars % 1 !== 0 ? '⯨' : ''}
        <span style={{ color: '#d1d5db' }}>{'★'.repeat(5 - Math.ceil(stars))}</span>
      </div>
      <div className="font-bold" style={{ fontSize: fontSize * 0.85, color: '#1f2937' }}>
        {score.toFixed(1).replace('.', ',')}
      </div>
    </div>
  )
}
