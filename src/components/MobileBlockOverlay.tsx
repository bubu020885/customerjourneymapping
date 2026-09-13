import { useEffect, useState } from 'react'
import { MonitorSmartphone } from 'lucide-react'
import { LwLogoIcon } from './LwHeader'

const BREAKPOINT = '(max-width: 767px)'
const LW_URL = 'https://leisureworkspace.com'

export function MobileBlockOverlay() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(BREAKPOINT)
    setIsMobile(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  if (!isMobile) return null

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-6 px-8 text-center"
      style={{ background: 'linear-gradient(135deg, #0D1F2E 0%, #132638 60%, #1A3048 100%)' }}
      role="alertdialog"
      aria-modal="true"
    >
      <LwLogoIcon size={56} />

      <div className="flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-white/70">
        <MonitorSmartphone size={20} />
      </div>

      <h1 className="text-xl font-extrabold tracking-[-0.3px] text-white">Nur auf dem Desktop verfügbar</h1>

      <p className="max-w-[320px] text-sm leading-relaxed text-white/70">
        Das Customer Journey Mapping Tool ist für die Bearbeitung am großen Bildschirm konzipiert. Die Nutzung ist
        aktuell nur auf einem Desktop- oder Laptop-Computer möglich.
      </p>

      <a
        href={LW_URL}
        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#F5C518] px-5 py-2.5 text-sm font-bold text-[#132638] no-underline transition-[filter] hover:brightness-95"
      >
        ← Zur Hauptseite
      </a>

      <div className="text-xs font-semibold text-white/40">
        <strong className="text-white/60">Leisure</strong>Workspace · Amusement Business Support
      </div>
    </div>
  )
}
