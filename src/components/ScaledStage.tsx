import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CANVAS_W, CANVAS_H } from '../layoutConstants'

export function ScaledStage({ children }: { children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.3)

  useEffect(() => {
    const el = outerRef.current
    if (!el) return
    const update = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      setScale(Math.min(w / CANVAS_W, h / CANVAS_H))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={outerRef} className="w-full h-full flex items-center justify-center overflow-hidden bg-gray-100">
      <div style={{ width: CANVAS_W * scale, height: CANVAS_H * scale, position: 'relative' }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>{children}</div>
      </div>
    </div>
  )
}
