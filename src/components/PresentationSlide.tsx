import { forwardRef } from 'react'
import { Image as ImageIcon, Target, Waypoints, AlertTriangle, Rocket, CheckCircle2, Trophy, ThumbsUp, Zap } from 'lucide-react'
import type { Phase, ProjectSettings, KpiData } from '../types'
import { EMOTION_META, DEFAULT_BODY_TEXT_COLOR, DEFAULT_PAIN_POINT_COLOR, DEFAULT_OPPORTUNITY_COLOR } from '../types'
import { CANVAS_W, CANVAS_H } from '../layoutConstants'

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

function PhotoArea({ photos }: { photos: string[] }) {
  if (photos.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl bg-gray-100 text-gray-300">
        <ImageIcon size={56} />
        <span className="text-base font-medium">Keine Fotos hinterlegt</span>
      </div>
    )
  }

  if (photos.length === 1) {
    return (
      <div className="h-full w-full overflow-hidden rounded-xl">
        <img src={photos[0]} alt="" className="h-full w-full object-cover" />
      </div>
    )
  }

  if (photos.length === 2) {
    return (
      <div className="flex h-full w-full gap-3">
        {photos.map((src, i) => (
          <div key={i} className="h-full flex-1 overflow-hidden rounded-xl">
            <img src={src} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    )
  }

  if (photos.length === 3) {
    return (
      <div className="flex h-full w-full gap-3">
        <div className="h-full flex-[1.4] overflow-hidden rounded-xl">
          <img src={photos[0]} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="flex h-full flex-1 flex-col gap-3">
          <div className="h-0 flex-1 overflow-hidden rounded-xl">
            <img src={photos[1]} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="h-0 flex-1 overflow-hidden rounded-xl">
            <img src={photos[2]} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-3">
      {photos.slice(0, 4).map((src, i) => (
        <div key={i} className="h-full w-full overflow-hidden rounded-xl">
          <img src={src} alt="" className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
  )
}

function List({ items, fontSize, color, bullet }: { items: string[]; fontSize: number; color: string; bullet: string }) {
  const filtered = items.filter(Boolean)
  if (filtered.length === 0) {
    return <p style={{ fontSize: fontSize * 0.75, color: '#9ca3af' }}>—</p>
  }
  return (
    <ul className="space-y-1.5" style={{ fontSize }}>
      {filtered.map((item, i) => (
        <li key={i} className="flex items-start gap-2 leading-snug" style={{ color }}>
          <span className="shrink-0 opacity-80">{bullet}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function SectionHeading({ icon, children, color }: { icon: React.ReactNode; children: React.ReactNode; color: string }) {
  return (
    <div className="flex items-center gap-2 font-bold uppercase tracking-wide" style={{ fontSize: 18, color }}>
      {icon}
      {children}
    </div>
  )
}

function SlideFooter({
  activeColor,
  totalSlides,
  currentIndex,
  leftLabel,
  rightLabel,
}: {
  activeColor: string
  totalSlides: number
  currentIndex: number
  leftLabel: string
  rightLabel: string
}) {
  return (
    <div className="flex shrink-0 items-center justify-between px-14 py-4" style={{ borderTop: '1px solid #e5e7eb' }}>
      <span className="text-sm font-semibold text-gray-400">{leftLabel}</span>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalSlides }, (_, i) => (
          <span
            key={i}
            className="h-1.5 rounded-full"
            style={{ width: i === currentIndex ? 22 : 8, background: i === currentIndex ? activeColor : '#e5e7eb' }}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-gray-400">{rightLabel}</span>
    </div>
  )
}

function ScoreDisplay({
  score,
  label,
  starColor,
  numberColor,
  tintColor,
}: {
  score: number
  label: string
  starColor: string
  numberColor: string
  tintColor: string
}) {
  const stars = Math.round((score / 10) * 5 * 2) / 2
  return (
    <div
      className="flex h-full w-[360px] shrink-0 flex-col items-center justify-center gap-3 rounded-xl"
      style={{ background: hexToRgba(tintColor, 0.08) }}
    >
      <span className="text-sm font-bold uppercase tracking-wide" style={{ color: '#6b7280' }}>
        {label}
      </span>
      <div style={{ fontSize: 40, letterSpacing: 3, color: starColor }}>
        {'★'.repeat(Math.floor(stars))}
        {stars % 1 !== 0 ? '⯨' : ''}
        <span style={{ color: '#d1d5db' }}>{'★'.repeat(5 - Math.ceil(stars))}</span>
      </div>
      <div className="font-black" style={{ fontSize: 44, color: numberColor }}>
        {score.toFixed(1).replace('.', ',')}
        <span style={{ fontSize: 20, color: '#9ca3af' }}> / 10</span>
      </div>
    </div>
  )
}

function InfoSlideBody({ phase }: { phase: Phase }) {
  const bodyColor = phase.bodyTextColor ?? DEFAULT_BODY_TEXT_COLOR
  return (
    <div className="flex flex-1 min-h-0 gap-8 px-14 py-8">
      <div className="min-h-0 flex-[1.5]">
        <PhotoArea photos={phase.photos ?? []} />
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-6">
        <div className="min-h-0 flex-1 overflow-hidden rounded-xl px-5 py-4" style={{ background: hexToRgba(phase.color, 0.06) }}>
          <SectionHeading icon={<Target size={20} />} color={phase.color}>
            Ziele &amp; Bedürfnisse
          </SectionHeading>
          <div className="mt-2">
            <List items={phase.goals} fontSize={19} color={bodyColor} bullet="•" />
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden rounded-xl px-5 py-4" style={{ background: hexToRgba(phase.color, 0.06) }}>
          <SectionHeading icon={<Waypoints size={20} />} color={phase.color}>
            Touchpoints
          </SectionHeading>
          <div className="mt-2">
            <List items={phase.touchpoints} fontSize={19} color={bodyColor} bullet="•" />
          </div>
        </div>
      </div>
    </div>
  )
}

function InsightsSlideBody({ phase, project }: { phase: Phase; project: ProjectSettings }) {
  return (
    <div className="flex flex-1 min-h-0 gap-8 px-14 py-8">
      <ScoreDisplay score={phase.score} label="Erlebnis-Score" starColor={phase.accent} numberColor={phase.color} tintColor={phase.color} />
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-6">
        <div className="min-h-0 overflow-hidden rounded-xl border-t-4 px-4 py-4" style={{ borderColor: phase.painPointColor ?? DEFAULT_PAIN_POINT_COLOR, background: '#fafafa' }}>
          <SectionHeading icon={<AlertTriangle size={20} />} color={phase.painPointColor ?? DEFAULT_PAIN_POINT_COLOR}>
            Pain Points
          </SectionHeading>
          <div className="mt-2">
            <List items={phase.painPoints} fontSize={17} color={phase.painPointColor ?? DEFAULT_PAIN_POINT_COLOR} bullet="✕" />
          </div>
        </div>
        <div className="min-h-0 overflow-hidden rounded-xl border-t-4 px-4 py-4" style={{ borderColor: phase.opportunityColor ?? DEFAULT_OPPORTUNITY_COLOR, background: '#fafafa' }}>
          <SectionHeading icon={<Rocket size={20} />} color={phase.opportunityColor ?? DEFAULT_OPPORTUNITY_COLOR}>
            Opportunities
          </SectionHeading>
          <div className="mt-2">
            <List items={phase.opportunities} fontSize={17} color={phase.opportunityColor ?? DEFAULT_OPPORTUNITY_COLOR} bullet="✓" />
          </div>
        </div>
        <div className="min-h-0 overflow-hidden rounded-xl border-t-4 px-4 py-4" style={{ borderColor: phase.recommendationColor ?? project.colors.secondary, background: '#fafafa' }}>
          <SectionHeading icon={<CheckCircle2 size={20} />} color={phase.recommendationColor ?? project.colors.secondary}>
            Handlungsempfehlungen
          </SectionHeading>
          <div className="mt-2">
            <List items={phase.recommendations} fontSize={17} color={phase.recommendationColor ?? project.colors.secondary} bullet="→" />
          </div>
        </div>
      </div>
    </div>
  )
}

interface SlideProps {
  phase: Phase
  project: ProjectSettings
  part: 1 | 2
  phaseIndex: number
  phaseCount: number
  totalSlides: number
  slideNumber: number
}

export const PresentationSlide = forwardRef<HTMLDivElement, SlideProps>(function PresentationSlide(
  { phase, project, part, phaseIndex, phaseCount, totalSlides, slideNumber },
  ref,
) {
  const emo = EMOTION_META[phase.emotion]
  return (
    <div
      ref={ref}
      data-presentation-slide
      className="flex flex-col overflow-hidden select-none"
      style={{
        width: CANVAS_W,
        height: CANVAS_H,
        background: '#ffffff',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div className="flex shrink-0 items-center gap-5 px-14 py-8" style={{ background: phase.color, color: phase.textColor }}>
        <span
          className="flex shrink-0 items-center justify-center rounded-full font-black"
          style={{ width: 60, height: 60, fontSize: 26, background: phase.accent, color: phase.color }}
        >
          {phase.number}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-4xl font-black leading-tight">{phase.title}</div>
          {phase.subtitle && <div className="truncate text-lg opacity-80">{phase.subtitle}</div>}
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-full bg-white/15 px-4 py-2">
          <span style={{ fontSize: 26 }}>{emo.emoji}</span>
          <span className="text-base font-semibold">{emo.label}</span>
        </div>
        <span className="shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold">Teil {part}/2</span>
        {project.logo && <img src={project.logo} alt="" className="h-11 shrink-0 object-contain" />}
      </div>

      {part === 1 ? <InfoSlideBody phase={phase} /> : <InsightsSlideBody phase={phase} project={project} />}

      <SlideFooter
        activeColor={phase.color}
        totalSlides={totalSlides}
        currentIndex={slideNumber}
        leftLabel={project.title}
        rightLabel={`Phase ${phaseIndex + 1} / ${phaseCount} · Folie ${part}/2`}
      />
    </div>
  )
})

interface KpiSlideProps {
  phases: Phase[]
  kpi: KpiData
  project: ProjectSettings
  totalSlides: number
  slideNumber: number
}

export const KpiSummarySlide = forwardRef<HTMLDivElement, KpiSlideProps>(function KpiSummarySlide(
  { phases, kpi, project, totalSlides, slideNumber },
  ref,
) {
  const avgScore = phases.length ? phases.reduce((sum, p) => sum + p.score, 0) / phases.length : 0
  return (
    <div
      ref={ref}
      data-presentation-slide
      className="flex flex-col overflow-hidden select-none"
      style={{
        width: CANVAS_W,
        height: CANVAS_H,
        background: '#ffffff',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div className="flex shrink-0 items-center gap-5 px-14 py-8" style={{ background: project.colors.primary, color: '#ffffff' }}>
        <span
          className="flex shrink-0 items-center justify-center rounded-full"
          style={{ width: 60, height: 60, background: project.colors.accent, color: project.colors.primary }}
        >
          <Trophy size={28} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-4xl font-black leading-tight">Zusammenfassung</div>
          <div className="truncate text-lg opacity-80">{project.title}</div>
        </div>
        {project.logo && <img src={project.logo} alt="" className="h-11 shrink-0 object-contain" />}
      </div>

      <div className="flex flex-1 min-h-0 flex-col gap-6 px-14 py-8">
        <div className="shrink-0 overflow-hidden rounded-xl px-6 py-5" style={{ background: hexToRgba(project.colors.primary, 0.06) }}>
          <SectionHeading icon={<Trophy size={20} />} color={project.colors.primary}>
            {kpi.insightTitle || 'Overall Journey Insight'}
          </SectionHeading>
          <p className="mt-2 leading-snug text-gray-700" style={{ fontSize: 19 }}>
            {kpi.insightText || '—'}
          </p>
        </div>

        <div className="flex min-h-0 flex-1 gap-8">
          <ScoreDisplay
            score={avgScore}
            label="Erlebnis-Score (Ø)"
            starColor={project.colors.accent}
            numberColor={project.colors.primary}
            tintColor={project.colors.primary}
          />
          <div className="grid min-h-0 flex-1 grid-cols-3 gap-6">
            <div className="min-h-0 overflow-hidden rounded-xl border-t-4 px-4 py-4" style={{ borderColor: '#c0272d', background: '#fafafa' }}>
              <SectionHeading icon={<AlertTriangle size={20} />} color="#c0272d">
                Top Pain Points
              </SectionHeading>
              <div className="mt-2">
                <List items={kpi.topPainPoints} fontSize={17} color="#c0272d" bullet="✕" />
              </div>
            </div>
            <div className="min-h-0 overflow-hidden rounded-xl border-t-4 px-4 py-4" style={{ borderColor: '#1f9d55', background: '#fafafa' }}>
              <SectionHeading icon={<ThumbsUp size={20} />} color="#1f9d55">
                Top Stärken
              </SectionHeading>
              <div className="mt-2">
                <List items={kpi.topStrengths} fontSize={17} color="#1f9d55" bullet="✓" />
              </div>
            </div>
            <div className="min-h-0 overflow-hidden rounded-xl border-t-4 px-4 py-4" style={{ borderColor: project.colors.secondary, background: '#fafafa' }}>
              <SectionHeading icon={<Zap size={20} />} color={project.colors.secondary}>
                Größte Hebel
              </SectionHeading>
              <div className="mt-2">
                <List items={kpi.topLevers} fontSize={17} color={project.colors.secondary} bullet="→" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <SlideFooter
        activeColor={project.colors.primary}
        totalSlides={totalSlides}
        currentIndex={slideNumber}
        leftLabel={project.title}
        rightLabel="Zusammenfassung"
      />
    </div>
  )
})
