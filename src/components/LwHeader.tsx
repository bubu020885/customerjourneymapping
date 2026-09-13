import { useState } from 'react'
import { useLang, type Lang } from '../i18n'

const LW_URL = 'https://leisureworkspace.com'

export function LwLogoIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="34" height="34" rx="8" fill="#1A7272" />
      <rect x="9" y="10" width="16" height="18" rx="2" stroke="white" strokeWidth="1.6" fill="none" />
      <rect x="13" y="8" width="8" height="4" rx="2" fill="#1A7272" stroke="white" strokeWidth="1.5" />
      <line x1="12" y1="16" x2="22" y2="16" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="12" y1="19.5" x2="22" y2="19.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="12" y1="23" x2="18" y2="23" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="24" cy="26" r="5" fill="#F5C518" />
      <polyline
        points="21.5,26 23.2,27.8 26.5,24.5"
        stroke="#132638"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <div className="flex shrink-0 items-center overflow-hidden rounded-full border-[1.5px] border-white/20" role="group">
      {(['de', 'en'] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 text-[11px] font-bold transition-colors ${
            lang === l ? 'bg-[#1A7272] text-white' : 'bg-transparent text-white/50 hover:text-white/80'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

function InfoModal({ onClose }: { onClose: () => void }) {
  const { t } = useLang()
  return (
    <div
      className="fixed inset-0 z-[9100] flex items-center justify-center bg-[rgba(19,38,56,0.55)] p-5"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start gap-3.5 bg-[#132638] px-6 pb-[18px] pt-5 text-white">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center">
            <LwLogoIcon size={40} />
          </div>
          <div>
            <div className="text-[17px] font-extrabold leading-tight tracking-[-0.3px]">{t('header.modalTitle')}</div>
            <div className="text-[11px] font-normal text-white/50">LeisureWorkspace · {t('header.tagline')}</div>
          </div>
          <button
            onClick={onClose}
            className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm text-white/70 transition-colors hover:bg-white/20"
          >
            ✕
          </button>
        </div>

        <div className="px-6 pb-6 pt-[22px]">
          <div className="mb-4">
            <div className="mb-1.5 flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.8px] text-[#1A7272]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#F5C518]" />
              {t('header.about')}
            </div>
            <p className="text-[13px] leading-relaxed text-[#5A6A7A]">{t('header.aboutText')}</p>
          </div>
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.8px] text-[#1A7272]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#F5C518]" />
              {t('header.aboutMaker')}
            </div>
            <p className="text-[13px] leading-relaxed text-[#5A6A7A]">
              <strong className="text-[#132638]">Stefan Burian</strong> — {t('header.aboutMakerText')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 border-t border-[#D0CBC0] px-6 py-3.5">
          <span className="mr-auto text-[11px] text-[#5A6A7A]">
            <strong className="text-[#132638]">Leisure</strong>Workspace · {t('header.tagline')}
          </span>
          <a
            href={LW_URL}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#F5C518] px-4 py-2 text-xs font-bold text-[#132638] transition-[filter] hover:brightness-95"
          >
            {t('header.footerAllTools')}
          </a>
        </div>
      </div>
    </div>
  )
}

export function LwHeader() {
  const { t } = useLang()
  const [infoOpen, setInfoOpen] = useState(false)

  return (
    <>
      <header
        className="flex h-[60px] shrink-0 items-center gap-2.5 border-b-[3px] border-[#F5C518] px-5 text-[#f1f5f9] shadow-[0_4px_20px_rgba(0,0,0,0.40)]"
        style={{ background: 'linear-gradient(135deg, #0D1F2E 0%, #132638 60%, #1A3048 100%)' }}
      >
        <a href={LW_URL} target="_blank" rel="noopener" title="LeisureWorkspace" className="flex shrink-0 items-center gap-2.5 no-underline">
          <LwLogoIcon />
          <div className="leading-tight">
            <div className="text-[13px] font-extrabold tracking-[-0.3px] text-white">
              Leisure<span className="text-[#1A7272]">Workspace</span>
            </div>
            <div className="text-[9.5px] font-normal text-white/45">{t('header.tagline')}</div>
          </div>
        </a>

        <div className="h-7 w-px shrink-0 bg-white/15" />

        <span className="mr-auto truncate text-[13px] font-semibold tracking-[-0.2px] text-white/85">{t('header.title')}</span>

        <button
          onClick={() => setInfoOpen(true)}
          title={t('header.info')}
          className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-white/25 text-[13px] font-bold text-white/70 transition-colors hover:border-[#F5C518] hover:text-[#F5C518]"
        >
          i
        </button>

        <LangToggle />

        <a
          href={LW_URL}
          target="_blank"
          rel="noopener"
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#F5C518] px-3.5 py-1.5 text-[11.5px] font-bold text-[#132638] no-underline transition-[filter] hover:brightness-95"
        >
          {t('header.allTools')}
        </a>
      </header>

      {infoOpen && <InfoModal onClose={() => setInfoOpen(false)} />}
    </>
  )
}
