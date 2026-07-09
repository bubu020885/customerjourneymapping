import { toCanvas } from 'html-to-image'
import { jsPDF } from 'jspdf'
import { CANVAS_W, CANVAS_H } from '../layoutConstants'

export type ExportFormat = 'png' | 'jpg' | 'pdf'

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10000)
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

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize('NFKD')
      .replace(DIACRITICS_REGEX, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'customer-journey-map'
  )
}

export async function exportCanvas(node: HTMLElement, format: ExportFormat, highRes: boolean, baseName: string) {
  const filename = slugify(baseName)
  const pixelRatio = highRes ? 3840 / CANVAS_W : 1
  const options = { pixelRatio, backgroundColor: '#ffffff', width: CANVAS_W, height: CANVAS_H, cacheBust: true }

  const canvas = await toCanvas(node, options)

  if (canvas.width === 0 || canvas.height === 0) {
    throw new Error('Die gerenderte Grafik ist leer. Bitte versuche es erneut.')
  }

  if (format === 'png') {
    const blob = await canvasToBlob(canvas, 'image/png')
    downloadBlob(blob, `${filename}.png`)
    return
  }

  if (format === 'jpg') {
    const blob = await canvasToBlob(canvas, 'image/jpeg', 0.95)
    downloadBlob(blob, `${filename}.jpg`)
    return
  }

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [CANVAS_W, CANVAS_H] })
  pdf.addImage(canvas, 'PNG', 0, 0, CANVAS_W, CANVAS_H)
  pdf.save(`${filename}.pdf`)
}
