import { Target, Contact, Heart, Star, AlertTriangle, Rocket, CheckCircle2, Layers } from 'lucide-react'
import type { ProjectSettings } from '../types'
import { LABEL_COL_W, computeRowBands } from '../layoutConstants'

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  goals: Target,
  touchpoints: Contact,
  emotion: Heart,
  score: Star,
  painPoints: AlertTriangle,
  opportunities: Rocket,
  recommendations: CheckCircle2,
}

export function RowLabelsColumn({ project }: { project: ProjectSettings }) {
  const bands = computeRowBands(project)

  return (
    <div
      className="flex-shrink-0 relative"
      style={{ width: LABEL_COL_W, background: project.colors.primary }}
    >
      <div
        className="absolute left-0 right-0 flex items-center gap-2 px-3 font-bold tracking-wide text-white/90 border-b border-white/10"
        style={{ top: bands.phaseHeaderBand.top - bands.rowsAreaTop, height: bands.phaseHeaderBand.height, fontSize: project.fontSize * 0.9 }}
      >
        <Layers size={project.fontSize * 1.1} />
        PHASEN
      </div>
      {bands.dataBands.map((band) => {
        const Icon = ICONS[band.key] ?? Target
        return (
          <div
            key={band.key}
            className="absolute left-0 right-0 flex flex-col items-start justify-center gap-1 px-3 border-b border-white/10"
            style={{ top: band.top - bands.rowsAreaTop, height: band.height }}
          >
            <div className="flex items-center gap-1.5 text-white/95 font-semibold uppercase" style={{ fontSize: project.fontSize * 0.72 }}>
              <Icon size={project.fontSize * 0.95} style={{ color: project.colors.accent }} />
              <span>{band.label}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
