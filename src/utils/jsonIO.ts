import type { JourneyMapData } from '../types'

export function exportJson(data: JourneyMapData, baseName: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${baseName || 'journey-map'}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
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
