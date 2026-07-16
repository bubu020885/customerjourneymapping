import { toCanvas } from 'html-to-image'
import { jsPDF } from 'jspdf'
import { CANVAS_W, CANVAS_H } from '../layoutConstants'

export type ExportFormat = 'png' | 'jpg' | 'pdf'

export interface ExportResult {
  blob: Blob
  url: string
  filename: string
  mimeType: string
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Canvas konnte nicht in eine Datei umgewandelt werden.'))),
      type,
      quality,
    )
  })
}

const DIACRITICS_REGEX = /[̀-ͯ]/g

export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize('NFKD')
      .replace(DIACRITICS_REGEX, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'customer-journey-map'
  )
}

/**
 * Renders the given node to the requested format and returns a Blob + object URL.
 * Does not trigger a download itself — some embedded/sandboxed browser contexts
 * silently swallow script-triggered `<a download>` clicks, so the caller is
 * expected to both attempt an automatic download AND offer the returned URL as
 * a manually-clickable link (a genuine user click is far more reliably allowed
 * to download/open than a script-synthesized one).
 */
export async function generateExport(node: HTMLElement, format: ExportFormat, highRes: boolean, baseName: string): Promise<ExportResult> {
  const baseFilename = slugify(baseName)
  const pixelRatio = highRes ? 3840 / CANVAS_W : 1
  const options = { pixelRatio, backgroundColor: '#ffffff', width: CANVAS_W, height: CANVAS_H, cacheBust: true }

  const canvas = await toCanvas(node, options)

  if (canvas.width === 0 || canvas.height === 0) {
    throw new Error('Die gerenderte Grafik ist leer. Bitte versuche es erneut.')
  }

  if (format === 'png') {
    const blob = await canvasToBlob(canvas, 'image/png')
    return { blob, url: URL.createObjectURL(blob), filename: `${baseFilename}.png`, mimeType: 'image/png' }
  }

  if (format === 'jpg') {
    const blob = await canvasToBlob(canvas, 'image/jpeg', 0.95)
    return { blob, url: URL.createObjectURL(blob), filename: `${baseFilename}.jpg`, mimeType: 'image/jpeg' }
  }

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [CANVAS_W, CANVAS_H] })
  pdf.addImage(canvas, 'PNG', 0, 0, CANVAS_W, CANVAS_H)
  const blob: Blob = pdf.output('blob')
  return { blob, url: URL.createObjectURL(blob), filename: `${baseFilename}.pdf`, mimeType: 'application/pdf' }
}

/**
 * Renders one node per presentation slide and combines them into a single multi-page PDF
 * (one page per phase), following the same landscape/16:9 page geometry as the main export.
 */
export async function generatePresentationExport(nodes: HTMLElement[], baseName: string): Promise<ExportResult> {
  if (nodes.length === 0) {
    throw new Error('Keine Phasen zum Exportieren vorhanden.')
  }
  const baseFilename = slugify(baseName)
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [CANVAS_W, CANVAS_H] })

  for (let i = 0; i < nodes.length; i++) {
    const canvas = await toCanvas(nodes[i], { pixelRatio: 1, backgroundColor: '#ffffff', width: CANVAS_W, height: CANVAS_H, cacheBust: true })
    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Die gerenderte Grafik ist leer. Bitte versuche es erneut.')
    }
    if (i > 0) pdf.addPage([CANVAS_W, CANVAS_H], 'landscape')
    pdf.addImage(canvas, 'PNG', 0, 0, CANVAS_W, CANVAS_H)
  }

  const blob: Blob = pdf.output('blob')
  return { blob, url: URL.createObjectURL(blob), filename: `${baseFilename}-praesentation.pdf`, mimeType: 'application/pdf' }
}

/** Best-effort automatic download. May silently no-op in sandboxed iframes — not the only path offered to the user. */
export function tryAutoDownload(result: ExportResult) {
  try {
    const a = document.createElement('a')
    a.href = result.url
    a.download = result.filename
    document.body.appendChild(a)
    a.click()
    a.remove()
  } catch {
    // ignored — the result modal's manual link is the guaranteed fallback
  }
}
