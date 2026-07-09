import type { JourneyMapData } from '../types'
import { slugify, type ExportResult } from './export'

export function generateJsonExport(data: JourneyMapData, baseName: string): ExportResult {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  return {
    blob,
    url: URL.createObjectURL(blob),
    filename: `${slugify(baseName)}.json`,
    mimeType: 'application/json',
  }
}

export function importJson(file: File): Promise<JourneyMapData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        if (!parsed.project || !Array.isArray(parsed.phases)) {
          throw new Error('Ungültiges Journey-Map-Format')
        }
        resolve(parsed as JourneyMapData)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}
