import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
  type PointerEvent as ReactPointerEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { CANVAS_W, CANVAS_H } from '../layoutConstants'

const MIN_ZOOM = 1
const MAX_ZOOM = 4
const ZOOM_STEP = 0.25
const DRAG_THRESHOLD = 4

export function ScaledStage({ children }: { children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null)
  const [fitScale, setFitScale] = useState(0.3)
  const [zoom, setZoom] = useState(1)
  const [isPanning, setIsPanning] = useState(false)
  const pendingCenter = useRef<{ x: number; y: number } | null>(null)
  const dragState = useRef<{ startX: number; startY: number; scrollLeft: number; scrollTop: number; moved: boolean } | null>(null)
  const suppressClick = useRef(false)

  useEffect(() => {
    const el = outerRef.current
    if (!el) return
    const update = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      setFitScale(Math.min(w / CANVAS_W, h / CANVAS_H))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const scale = fitScale * zoom

  // Keep the point that was at the viewport center stable while zooming.
  useLayoutEffect(() => {
    const el = outerRef.current
    if (!el || !pendingCenter.current) return
    el.scrollLeft = pendingCenter.current.x * scale - el.clientWidth / 2
    el.scrollTop = pendingCenter.current.y * scale - el.clientHeight / 2
    pendingCenter.current = null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale])

  function zoomBy(delta: number) {
    const el = outerRef.current
    if (!el) return
    const currentScale = scale
    pendingCenter.current = {
      x: (el.scrollLeft + el.clientWidth / 2) / currentScale,
      y: (el.scrollTop + el.clientHeight / 2) / currentScale,
    }
    setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round((z + delta) * 100) / 100)))
  }

  function resetView() {
    setZoom(1)
  }

  function handleWheel(e: ReactWheelEvent<HTMLDivElement>) {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      zoomBy(e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP)
    }
    // Otherwise let the browser handle native scrolling (trackpad/wheel panning).
  }

  // Click-and-drag panning. Elements that need their own drag/click behaviour (the phase
  // reorder handle, delete button, ...) opt out via [data-pan-ignore] so this never steals
  // their pointer events.
  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return
    if ((e.target as HTMLElement).closest('[data-pan-ignore]')) return
    const el = outerRef.current
    if (!el) return
    dragState.current = { startX: e.clientX, startY: e.clientY, scrollLeft: el.scrollLeft, scrollTop: el.scrollTop, moved: false }
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragState.current
    const el = outerRef.current
    if (!drag || !el) return
    const dx = e.clientX - drag.startX
    const dy = e.clientY - drag.startY
    if (!drag.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      drag.moved = true
      setIsPanning(true)
    }
    if (drag.moved) {
      el.scrollLeft = drag.scrollLeft - dx
      el.scrollTop = drag.scrollTop - dy
    }
  }

  function endPan() {
    if (dragState.current?.moved) {
      suppressClick.current = true
      // Clear on the next tick, after the browser's own click event (fired on pointerup) runs.
      setTimeout(() => {
        suppressClick.current = false
      }, 0)
    }
    dragState.current = null
    setIsPanning(false)
  }

  function handleClickCapture(e: ReactMouseEvent<HTMLDivElement>) {
    if (suppressClick.current) {
      e.stopPropagation()
      e.preventDefault()
    }
  }

  const zoomPercent = Math.round(scale * 100)
  const canZoomIn = zoom < MAX_ZOOM - 0.001
  const canZoomOut = zoom > MIN_ZOOM + 0.001

  return (
    <div className="relative w-full h-full">
      <div
        ref={outerRef}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endPan}
        onPointerLeave={endPan}
        onClickCapture={handleClickCapture}
        className="w-full h-full overflow-auto bg-gray-100"
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        <div style={{ width: CANVAS_W * scale, height: CANVAS_H * scale, margin: 'auto' }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>{children}</div>
        </div>
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-0.5 rounded-lg bg-white shadow-md border border-gray-200 px-1 py-1">
        <button
          onClick={() => zoomBy(-ZOOM_STEP)}
          disabled={!canZoomOut}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent"
          title="Verkleinern"
        >
          <ZoomOut size={16} />
        </button>
        <span className="text-xs w-11 text-center tabular-nums text-gray-600">{zoomPercent}%</span>
        <button
          onClick={() => zoomBy(ZOOM_STEP)}
          disabled={!canZoomIn}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent"
          title="Vergrößern"
        >
          <ZoomIn size={16} />
        </button>
        <div className="w-px h-5 bg-gray-200 mx-0.5" />
        <button
          onClick={resetView}
          disabled={zoom === 1}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent"
          title="Ansicht einpassen"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {zoom > 1 && (
        <div className="absolute bottom-3 left-3 rounded-md bg-black/60 text-white text-[11px] px-2 py-1 pointer-events-none">
          Ziehen oder Scrollen zum Verschieben · Strg + Scrollen zum Zoomen
        </div>
      )}
    </div>
  )
}
