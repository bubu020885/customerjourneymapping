import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X, FileText, Download } from 'lucide-react'
import type { Phase, ProjectSettings } from '../types'
import { CANVAS_W, CANVAS_H } from '../layoutConstants'
import { PresentationSlide } from './PresentationSlide'

export function PresentationView({
  phases,
  project,
  index,
  onIndexChange,
  onExit,
  onExportPdf,
  exporting,
}: {
  phases: Phase[]
  project: ProjectSettings
  index: number
  onIndexChange: (i: number) => void
  onExit: () => void
  onExportPdf: () => void
  exporting: boolean
}) {
  const outerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.3)
  const phase = phases[index]

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
      if (e.key === 'ArrowRight') onIndexChange(Math.min(phases.length - 1, index + 1))
      else if (e.key === 'ArrowLeft') onIndexChange(Math.max(0, index - 1))
      else if (e.key === 'Escape') onExit()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [index, phases.length, onIndexChange, onExit])

  if (!phase) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-900">
      <div className="flex shrink-0 items-center gap-2 px-4 py-2.5 bg-gray-800 text-white">
        <span className="font-bold mr-2">Präsentationsmodus</span>

        <button
          onClick={() => onIndexChange(Math.max(0, index - 1))}
          disabled={index === 0}
          className="flex items-center gap-1 rounded-md border border-white/20 px-2.5 py-1.5 text-sm hover:bg-white/10 disabled:opacity-30"
          title="Vorherige Phase"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm tabular-nums w-24 text-center text-white/80">
          Phase {index + 1} / {phases.length}
        </span>
        <button
          onClick={() => onIndexChange(Math.min(phases.length - 1, index + 1))}
          disabled={index === phases.length - 1}
          className="flex items-center gap-1 rounded-md border border-white/20 px-2.5 py-1.5 text-sm hover:bg-white/10 disabled:opacity-30"
          title="Nächste Phase"
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
            <PresentationSlide phase={phase} project={project} index={index} total={phases.length} />
          </div>
        </div>

        {index > 0 && (
          <button
            onClick={() => onIndexChange(index - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            title="Vorherige Phase"
          >
            <ChevronLeft size={22} />
          </button>
        )}
        {index < phases.length - 1 && (
          <button
            onClick={() => onIndexChange(index + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            title="Nächste Phase"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>
    </div>
  )
}
