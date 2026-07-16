import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X, FileText, Download } from 'lucide-react'
import type { Phase, ProjectSettings } from '../types'
import { CANVAS_W, CANVAS_H } from '../layoutConstants'
import { PresentationSlide } from './PresentationSlide'

export function PresentationView({
  phases,
  project,
  slideIndex,
  onSlideIndexChange,
  onExit,
  onExportPdf,
  exporting,
}: {
  phases: Phase[]
  project: ProjectSettings
  slideIndex: number
  onSlideIndexChange: (i: number) => void
  onExit: () => void
  onExportPdf: () => void
  exporting: boolean
}) {
  const outerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.3)

  const totalSlides = phases.length * 2
  const phaseIndex = Math.floor(slideIndex / 2)
  const part = ((slideIndex % 2) + 1) as 1 | 2
  const phase = phases[phaseIndex]

  useEffect(() => {
    const el = outerRef.current
    if (!el) return
    const update = () => {
      setScale(Math.min(el.clientWidth / CANVAS_W, el.clientHeight / CANVAS_H))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') onSlideIndexChange(Math.min(totalSlides - 1, slideIndex + 1))
      else if (e.key === 'ArrowLeft') onSlideIndexChange(Math.max(0, slideIndex - 1))
      else if (e.key === 'Escape') onExit()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [slideIndex, totalSlides, onSlideIndexChange, onExit])

  if (!phase) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-900">
      <div className="flex shrink-0 items-center gap-2 px-4 py-2.5 bg-gray-800 text-white">
        <span className="font-bold mr-2">Präsentationsmodus</span>

        <button
          onClick={() => onSlideIndexChange(Math.max(0, slideIndex - 1))}
          disabled={slideIndex === 0}
          className="flex items-center gap-1 rounded-md border border-white/20 px-2.5 py-1.5 text-sm hover:bg-white/10 disabled:opacity-30"
          title="Vorherige Folie"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm tabular-nums w-40 text-center text-white/80">
          Phase {phaseIndex + 1} / {phases.length} · Folie {part}/2
        </span>
        <button
          onClick={() => onSlideIndexChange(Math.min(totalSlides - 1, slideIndex + 1))}
          disabled={slideIndex === totalSlides - 1}
          className="flex items-center gap-1 rounded-md border border-white/20 px-2.5 py-1.5 text-sm hover:bg-white/10 disabled:opacity-30"
          title="Nächste Folie"
        >
          <ChevronRight size={16} />
        </button>

        <div className="h-6 w-px bg-white/20 mx-1" />

        <button
          disabled={exporting}
          onClick={onExportPdf}
          className="flex items-center gap-1 rounded-md border border-white/20 px-2.5 py-1.5 text-sm hover:bg-white/10 disabled:opacity-50"
          title="Präsentation als PDF exportieren"
        >
          <FileText size={16} /> Als PDF exportieren
        </button>
        {exporting && (
          <span className="flex items-center gap-1 text-xs text-amber-300">
            <Download size={14} className="animate-bounce" /> Export läuft…
          </span>
        )}

        <div className="flex-1" />
        <span className="text-xs text-white/40 mr-2">Steuerung: ← → · Esc zum Beenden</span>
        <button
          onClick={onExit}
          className="flex items-center gap-1 rounded-md bg-white/10 px-3 py-1.5 text-sm font-medium hover:bg-white/20"
          title="Präsentation beenden"
        >
          <X size={16} /> Beenden
        </button>
      </div>

      <div ref={outerRef} className="relative flex flex-1 min-h-0 items-center justify-center overflow-hidden">
        <div style={{ width: CANVAS_W * scale, height: CANVAS_H * scale }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', boxShadow: '0 10px 40px rgba(0,0,0,0.4)' }}>
            <PresentationSlide phase={phase} project={project} part={part} phaseIndex={phaseIndex} phaseCount={phases.length} />
          </div>
        </div>

        {slideIndex > 0 && (
          <button
            onClick={() => onSlideIndexChange(slideIndex - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            title="Vorherige Folie"
          >
            <ChevronLeft size={22} />
          </button>
        )}
        {slideIndex < totalSlides - 1 && (
          <button
            onClick={() => onSlideIndexChange(slideIndex + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            title="Nächste Folie"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>
    </div>
  )
}
