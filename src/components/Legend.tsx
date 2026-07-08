import type { ProjectSettings } from '../types'
import { EMOTION_META, EMOTION_ORDER } from '../types'
import { LEGEND_H } from '../layoutConstants'

export function Legend({ project }: { project: ProjectSettings }) {
  return (
    <div
      className="flex items-center gap-5 px-5 shrink-0 border-b"
      style={{ height: LEGEND_H, background: '#fafafa', borderColor: '#e5e7eb', fontSize: project.fontSize * 0.62 }}
    >
      <span className="font-bold uppercase" style={{ color: project.colors.primary }}>
        Legende:
      </span>
      {EMOTION_ORDER.map((e) => (
        <span key={e} className="flex items-center gap-1">
          <span>{EMOTION_META[e].emoji}</span>
          <span style={{ color: '#4b5563' }}>{EMOTION_META[e].label}</span>
        </span>
      ))}
      <span className="flex items-center gap-1">
        <span style={{ color: '#c0272d' }}>✕</span>
        <span style={{ color: '#4b5563' }}>Pain Point</span>
      </span>
      <span className="flex items-center gap-1">
        <span style={{ color: '#1f9d55' }}>✓</span>
        <span style={{ color: '#4b5563' }}>Opportunity</span>
      </span>
      <span className="flex items-center gap-1">
        <span style={{ color: project.colors.secondary }}>→</span>
        <span style={{ color: '#4b5563' }}>Handlungsempfehlung</span>
      </span>
    </div>
  )
}
