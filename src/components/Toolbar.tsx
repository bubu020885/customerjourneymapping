import { useRef, useState } from 'react'
import { Plus, Download, FileJson, Upload, FileImage, FileText, Presentation } from 'lucide-react'
import type { ExportFormat } from '../utils/export'
import { useLang } from '../i18n'

export function Toolbar({
  onAddPhase,
  onExport,
  onExportJson,
  onImportJson,
  onStartPresentation,
  exporting,
}: {
  onAddPhase: () => void
  onExport: (format: ExportFormat, highRes: boolean) => void
  onExportJson: () => void
  onImportJson: (file: File) => void
  onStartPresentation: () => void
  exporting: boolean
}) {
  const { t } = useLang()
  const [highRes, setHighRes] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-[#D0CBC0] bg-white shrink-0 flex-wrap">
      <span className="font-black text-[#132638] mr-2">{t('toolbar.title')}</span>

      <button
        onClick={onAddPhase}
        className="flex items-center gap-1 rounded-md bg-[#132638] text-white px-3 py-1.5 text-sm font-medium hover:bg-[#1A3048]"
      >
        <Plus size={16} /> {t('toolbar.addPhase')}
      </button>

      <div className="h-6 w-px bg-[#D0CBC0] mx-1" />

      <label className="flex items-center gap-1.5 text-xs text-[#5A6A7A] select-none">
        <input type="checkbox" checked={highRes} onChange={(e) => setHighRes(e.target.checked)} />
        {t('toolbar.highRes')}
      </label>

      <button
        disabled={exporting}
        onClick={() => onExport('png', highRes)}
        className="flex items-center gap-1 rounded-md border border-[#D0CBC0] text-[#132638] px-3 py-1.5 text-sm hover:bg-[#EDEAE0] disabled:opacity-50"
      >
        <FileImage size={16} /> PNG
      </button>
      <button
        disabled={exporting}
        onClick={() => onExport('jpg', highRes)}
        className="flex items-center gap-1 rounded-md border border-[#D0CBC0] text-[#132638] px-3 py-1.5 text-sm hover:bg-[#EDEAE0] disabled:opacity-50"
      >
        <FileImage size={16} /> JPG
      </button>
      <button
        disabled={exporting}
        onClick={() => onExport('pdf', highRes)}
        className="flex items-center gap-1 rounded-md border border-[#D0CBC0] text-[#132638] px-3 py-1.5 text-sm hover:bg-[#EDEAE0] disabled:opacity-50"
      >
        <FileText size={16} /> PDF
      </button>

      <div className="h-6 w-px bg-[#D0CBC0] mx-1" />

      <button
        onClick={onExportJson}
        className="flex items-center gap-1 rounded-md border border-[#D0CBC0] text-[#132638] px-3 py-1.5 text-sm hover:bg-[#EDEAE0]"
      >
        <FileJson size={16} /> {t('toolbar.jsonExport')}
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-1 rounded-md border border-[#D0CBC0] text-[#132638] px-3 py-1.5 text-sm hover:bg-[#EDEAE0]"
      >
        <Upload size={16} /> {t('toolbar.jsonImport')}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onImportJson(file)
          e.target.value = ''
        }}
      />

      <div className="h-6 w-px bg-[#D0CBC0] mx-1" />

      <button
        onClick={onStartPresentation}
        className="flex items-center gap-1 rounded-md bg-[#1A7272] text-white px-3 py-1.5 text-sm font-medium hover:bg-[#158080]"
      >
        <Presentation size={16} /> {t('toolbar.startPresentation')}
      </button>

      <div className="flex-1" />

      {exporting && (
        <span className="flex items-center gap-1 text-xs text-[#1A7272]">
          <Download size={14} className="animate-bounce" /> {t('toolbar.exporting')}
        </span>
      )}
    </div>
  )
}
