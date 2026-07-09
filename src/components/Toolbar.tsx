import { useRef, useState } from 'react'
import { Plus, Download, FileJson, Upload, FileImage, FileText } from 'lucide-react'
import type { ExportFormat } from '../utils/export'

export function Toolbar({
  onAddPhase,
  onExport,
  onExportJson,
  onImportJson,
  exporting,
}: {
  onAddPhase: () => void
  onExport: (format: ExportFormat, highRes: boolean) => void
  onExportJson: () => void
  onImportJson: (file: File) => void
  exporting: boolean
}) {
  const [highRes, setHighRes] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 bg-white shrink-0 flex-wrap">
      <span className="font-black text-gray-800 mr-2">Journey Map Builder</span>

      <button
        onClick={onAddPhase}
        className="flex items-center gap-1 rounded-md bg-gray-900 text-white px-3 py-1.5 text-sm font-medium hover:bg-gray-700"
      >
        <Plus size={16} /> Phase hinzufügen
      </button>

      <div className="h-6 w-px bg-gray-200 mx-1" />

      <label className="flex items-center gap-1.5 text-xs text-gray-600 select-none">
        <input type="checkbox" checked={highRes} onChange={(e) => setHighRes(e.target.checked)} />
        Hochauflösend (3840×2160)
      </label>

      <button
        disabled={exporting}
        onClick={() => onExport('png', highRes)}
        className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
      >
        <FileImage size={16} /> PNG
      </button>
      <button
        disabled={exporting}
        onClick={() => onExport('jpg', highRes)}
        className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
      >
        <FileImage size={16} /> JPG
      </button>
      <button
        disabled={exporting}
        onClick={() => onExport('pdf', highRes)}
        className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
      >
        <FileText size={16} /> PDF
      </button>

      <div className="h-6 w-px bg-gray-200 mx-1" />

      <button
        onClick={onExportJson}
        className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
      >
        <FileJson size={16} /> JSON exportieren
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
      >
        <Upload size={16} /> JSON importieren
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

      <div className="flex-1" />

      {exporting && (
        <span className="flex items-center gap-1 text-xs text-amber-600">
          <Download size={14} className="animate-bounce" /> Export läuft…
        </span>
      )}
    </div>
  )
}
