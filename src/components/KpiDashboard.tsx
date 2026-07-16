import { Trophy, AlertTriangle, ThumbsUp, Zap } from 'lucide-react'
import type { KpiData, Phase, ProjectSettings } from '../types'
import { FOOTER_H } from '../layoutConstants'

function GesGauge({ value, project }: { value: number; project: ProjectSettings }) {
  const pct = Math.max(0, Math.min(10, value)) / 10
  const r = 34
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <svg width={90} height={90} viewBox="0 0 90 90">
        <circle cx={45} cy={45} r={r} fill="none" stroke="#e5e7eb" strokeWidth={9} />
        <circle
          cx={45}
          cy={45}
          r={r}
          fill="none"
          stroke={project.colors.accent}
          strokeWidth={9}
          strokeDasharray={`${c * pct} ${c}`}
          strokeLinecap="round"
          transform="rotate(-90 45 45)"
        />
        <text x={45} y={42} textAnchor="middle" fontSize={20} fontWeight={800} fill={project.colors.primary}>
          {value.toFixed(1).replace('.', ',')}
        </text>
        <text x={45} y={58} textAnchor="middle" fontSize={9} fill="#6b7280">
          / 10
        </text>
      </svg>
    </div>
  )
}

function EmotionLineChart({ phases, project }: { phases: Phase[]; project: ProjectSettings }) {
  const w = 180
  const h = 60
  const pad = 6
  if (phases.length === 0) return null
  const points = phases.map((p, i) => {
    const x = pad + (i / Math.max(1, phases.length - 1)) * (w - pad * 2)
    const y = h - pad - (p.score / 10) * (h - pad * 2)
    return { x, y, score: p.score }
  })
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d={path} fill="none" stroke={project.colors.secondary} strokeWidth={2} strokeDasharray="4 3" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill={project.colors.accent} stroke={project.colors.primary} strokeWidth={0.5} />
      ))}
    </svg>
  )
}

function ListCard({
  icon,
  title,
  items,
  accent,
  project,
}: {
  icon: React.ReactNode
  title: string
  items: string[]
  accent: string
  project: ProjectSettings
}) {
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-1 px-3 border-l" style={{ borderColor: '#e5e7eb' }}>
      <div className="flex items-center gap-1.5 font-bold uppercase" style={{ fontSize: project.fontSize * 0.68, color: accent }}>
        {icon}
        {title}
      </div>
      <ul className="space-y-0.5" style={{ fontSize: project.fontSize * 0.62 }}>
        {items.slice(0, 5).map((it, i) => (
          <li key={i} className="flex gap-1 text-gray-700 leading-tight">
            <span style={{ color: accent }} className="shrink-0">
              {i + 1}.
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function KpiDashboard({ kpi, phases, project }: { kpi: KpiData; phases: Phase[]; project: ProjectSettings }) {
  if (!project.showKpi && !project.showSummary) return null
  return (
    <div className="flex shrink-0 border-t-2" style={{ height: FOOTER_H, borderColor: project.colors.primary }}>
      {project.showSummary && (
        <div
          className="flex flex-col justify-center gap-1.5 px-4 shrink-0"
          style={{ width: 320, background: project.colors.primary, color: 'white' }}
        >
          <div className="flex items-center gap-2 font-bold uppercase" style={{ fontSize: project.fontSize * 0.78, color: project.colors.accent }}>
            <Trophy size={project.fontSize * 1.1} />
            {kpi.insightTitle}
          </div>
          <p className="opacity-90 leading-snug" style={{ fontSize: project.fontSize * 0.68 }}>
            {kpi.insightText}
          </p>
        </div>
      )}

      {project.showKpi && (
        <>
          <div className="flex flex-col items-center justify-center gap-1 px-4 shrink-0 border-l" style={{ borderColor: '#e5e7eb', width: 150 }}>
            <div className="uppercase font-bold text-center" style={{ fontSize: project.fontSize * 0.6, color: '#6b7280' }}>
              Guest Effort Score
            </div>
            <GesGauge value={kpi.guestEffortScore} project={project} />
            <div className="text-center opacity-70" style={{ fontSize: project.fontSize * 0.48, color: '#6b7280' }}>
              0 = gering · 10 = hoch
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-1 px-4 shrink-0 border-l" style={{ borderColor: '#e5e7eb', width: 210 }}>
            <div className="uppercase font-bold text-center" style={{ fontSize: project.fontSize * 0.6, color: '#6b7280' }}>
              Emotional Journey Score
            </div>
            <EmotionLineChart phases={phases} project={project} />
          </div>

          <ListCard
            icon={<AlertTriangle size={project.fontSize * 0.9} />}
            title="Top 5 Pain Points"
            items={kpi.topPainPoints}
            accent="#c0272d"
            project={project}
          />
          <ListCard
            icon={<ThumbsUp size={project.fontSize * 0.9} />}
            title="Top Stärken"
            items={kpi.topStrengths}
            accent="#1f9d55"
            project={project}
          />
          <ListCard
            icon={<Zap size={project.fontSize * 0.9} />}
            title="Größte Hebel"
            items={kpi.topLevers}
            accent={project.colors.secondary}
            project={project}
          />
        </>
      )}
    </div>
  )
}
