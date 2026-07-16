import { forwardRef } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import type { Phase, ProjectSettings } from '../types'
import { EMOTION_META } from '../types'
import { CANVAS_W, CANVAS_H } from '../layoutConstants'

interface Props {
  phase: Phase
  project: ProjectSettings
  index: number
  total: number
}

function PhotoArea({ photos }: { photos: string[] }) {
  if (photos.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl bg-gray-100 text-gray-300">
        <ImageIcon size={64} />
        <span className="text-lg font-medium">Keine Fotos hinterlegt</span>
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
      <div className="flex h-full w-full gap-4">
        {photos.map((src, i) => (
          <div key={i} className="h-full flex-1 overflow-hidden rounded-xl">
            <img src={src} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex h-full w-full gap-4">
      <div className="h-full flex-[1.4] overflow-hidden rounded-xl">
        <img src={photos[0]} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="flex h-full flex-1 flex-col gap-4">
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

export const PresentationSlide = forwardRef<HTMLDivElement, Props>(function PresentationSlide(
  { phase, project, index, total },
  ref,
) {
  const emo = EMOTION_META[phase.emotion]
  const photos = phase.photos ?? []

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
      {/* Header */}
      <div
        className="flex shrink-0 items-center gap-5 px-14 py-9"
        style={{ background: project.colors.primary, color: '#ffffff' }}
      >
        <span
          className="flex shrink-0 items-center justify-center rounded-full font-black"
          style={{ width: 64, height: 64, fontSize: 28, background: project.colors.accent, color: project.colors.primary }}
        >
          {phase.number}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-4xl font-black leading-tight">{phase.title}</div>
          {phase.subtitle && <div className="truncate text-lg opacity-80">{phase.subtitle}</div>}
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-full bg-white/15 px-4 py-2">
          <span style={{ fontSize: 28 }}>{emo.emoji}</span>
          <span className="text-base font-semibold">{emo.label}</span>
        </div>
        {project.logo && <img src={project.logo} alt="" className="h-12 shrink-0 object-contain" />}
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0 flex-col gap-6 px-14 py-8">
        {phase.description && (
          <p className="shrink-0 text-xl leading-snug text-gray-700 line-clamp-2">{phase.description}</p>
        )}
        <div className="min-h-0 flex-1">
          <PhotoArea photos={photos} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 items-center justify-between px-14 py-5" style={{ borderTop: '1px solid #e5e7eb' }}>
        <span className="text-sm font-semibold text-gray-400">{project.title}</span>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className="h-1.5 rounded-full"
              style={{
                width: i === index ? 22 : 8,
                background: i === index ? project.colors.accent : '#e5e7eb',
                transition: 'width 0.15s ease',
              }}
            />
          ))}
        </div>
        <span className="text-sm font-semibold text-gray-400">
          Phase {index + 1} / {total}
        </span>
      </div>
    </div>
  )
})
