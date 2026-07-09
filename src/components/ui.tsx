import type { ChangeEvent } from 'react'

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-gray-600">
      <span className="uppercase tracking-wide text-[10px] text-gray-400">{label}</span>
      {children}
    </label>
  )
}

export function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
    />
  )
}

export function TextArea({ value, onChange, rows = 2 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-amber-400"
    />
  )
}

export function ListEditor({ items, onChange, rows = 3 }: { items: string[]; onChange: (items: string[]) => void; rows?: number }) {
  return (
    <TextArea
      value={items.join('\n')}
      rows={rows}
      onChange={(v) =>
        onChange(
          v.split('\n'),
        )
      }
    />
  )
}

export function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-10 shrink-0 rounded border border-gray-300 cursor-pointer bg-transparent"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 min-w-0 rounded-md border border-gray-300 px-2 py-1 text-sm font-mono"
      />
    </div>
  )
}

export function SliderInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix = '',
}: {
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  suffix?: string
}) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 min-w-0"
      />
      <span className="text-xs w-12 shrink-0 text-right text-gray-500 tabular-nums">
        {value}
        {suffix}
      </span>
    </div>
  )
}

export function Select<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm bg-white"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

export function ImageUpload({ value, onChange, label = 'Bild hochladen' }: { value: string; onChange: (v: string) => void; label?: string }) {
  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(String(reader.result))
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex items-center gap-2">
      {value && <img src={value} alt="" className="h-10 w-10 rounded object-cover border border-gray-200" />}
      <label className="flex-1 cursor-pointer rounded-md border border-dashed border-gray-300 px-2 py-1.5 text-xs text-gray-500 text-center hover:bg-gray-50">
        {label}
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </label>
      {value && (
        <button onClick={() => onChange('')} className="text-xs text-gray-400 hover:text-red-500">
          Entfernen
        </button>
      )}
    </div>
  )
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center justify-between gap-2 text-sm text-gray-700 cursor-pointer">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-8 accent-amber-500"
      />
    </label>
  )
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-bold text-gray-800 mt-1 mb-0.5">{children}</h3>
}
