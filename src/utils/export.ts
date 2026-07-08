import { toPng, toJpeg } from 'html-to-image'
import { jsPDF } from 'jspdf'
import { CANVAS_W, CANVAS_H } from '../layoutConstants'

export type ExportFormat = 'png' | 'jpg' | 'pdf'

function download(dataUrl: string, filename: string) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
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

  if (format === 'png') {
    const dataUrl = await toPng(node, options)
    download(dataUrl, `${filename}.png`)
    return
  }

  if (format === 'jpg') {
    const dataUrl = await toJpeg(node, { ...options, quality: 0.95 })
    download(dataUrl, `${filename}.jpg`)
    return
  }

  const dataUrl = await toPng(node, options)
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [CANVAS_W, CANVAS_H] })
  pdf.addImage(dataUrl, 'PNG', 0, 0, CANVAS_W, CANVAS_H)
  pdf.save(`${filename}.pdf`)
}
