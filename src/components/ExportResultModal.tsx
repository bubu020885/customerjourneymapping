import { Download, ExternalLink, X, CheckCircle2 } from 'lucide-react'
import type { ExportResult } from '../utils/export'

export function ExportResultModal({ result, onClose }: { result: ExportResult; onClose: () => void }) {
  const isImage = result.mimeType.startsWith('image/')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <CheckCircle2 size={18} className="text-emerald-500" />
            Export bereit
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3">
          <p className="text-xs text-gray-500">
            Falls der Download nicht automatisch gestartet ist (z. B. in einer eingebetteten Vorschau), nutze einen der Links unten.
          </p>

          {isImage && (
            <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
              <img src={result.url} alt="Export-Vorschau" className="w-full h-40 object-contain" />
            </div>
          )}

          <div className="text-xs text-gray-500 truncate">
            Datei: <span className="font-mono text-gray-700">{result.filename}</span>
          </div>

          <a
            href={result.url}
            download={result.filename}
            className="flex items-center justify-center gap-2 rounded-md bg-gray-900 text-white px-3 py-2.5 text-sm font-medium hover:bg-gray-700"
          >
            <Download size={16} /> Datei herunterladen
          </a>

          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <ExternalLink size={16} /> In neuem Tab öffnen
          </a>
        </div>
      </div>
    </div>
  )
}
