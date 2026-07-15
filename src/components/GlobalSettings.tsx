import type { ProjectSettings } from '../types'
import { Field, TextInput, TextArea, ColorInput, SliderInput, ImageUpload, Toggle, SectionTitle } from './ui'

export function GlobalSettings({ project, onChange }: { project: ProjectSettings; onChange: (patch: Partial<ProjectSettings>) => void }) {
  return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto h-full">
      <SectionTitle>Report</SectionTitle>

      <Field label="Report-Titel">
        <TextInput value={project.title} onChange={(title) => onChange({ title })} />
      </Field>
      <Field label="Untertitel">
        <TextInput value={project.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
      </Field>
      <Field label="Kunde / Projektname">
        <TextInput value={project.client} onChange={(client) => onChange({ client })} />
      </Field>
      <Field label="Testpersona / Zielgruppe">
        <TextArea value={project.persona} onChange={(persona) => onChange({ persona })} rows={3} />
      </Field>
      <Field label="Logo">
        <ImageUpload value={project.logo} onChange={(logo) => onChange({ logo })} label="Logo hochladen oder hierher ziehen" />
      </Field>

      <SectionTitle>CI-Farben</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Primärfarbe">
          <ColorInput value={project.colors.primary} onChange={(primary) => onChange({ colors: { ...project.colors, primary } })} />
        </Field>
        <Field label="Sekundärfarbe">
          <ColorInput value={project.colors.secondary} onChange={(secondary) => onChange({ colors: { ...project.colors, secondary } })} />
        </Field>
        <Field label="Akzentfarbe">
          <ColorInput value={project.colors.accent} onChange={(accent) => onChange({ colors: { ...project.colors, accent } })} />
        </Field>
        <Field label="Hintergrundfarbe">
          <ColorInput value={project.colors.background} onChange={(background) => onChange({ colors: { ...project.colors, background } })} />
        </Field>
        <Field label="Sidebar-Text (Zeilenbeschriftungen)">
          <ColorInput
            value={project.colors.sidebarText ?? '#ffffff'}
            onChange={(sidebarText) => onChange({ colors: { ...project.colors, sidebarText } })}
          />
        </Field>
      </div>

      <SectionTitle>Layout</SectionTitle>
      <Field label="Schriftgröße">
        <SliderInput value={project.fontSize} onChange={(fontSize) => onChange({ fontSize })} min={10} max={20} step={0.5} suffix="px" />
      </Field>
      <Field label="Kartenrundung">
        <SliderInput value={project.cardRadius} onChange={(cardRadius) => onChange({ cardRadius })} min={0} max={28} suffix="px" />
      </Field>
      <Field label="Spaltenabstand">
        <SliderInput value={project.columnGap} onChange={(columnGap) => onChange({ columnGap })} min={0} max={32} suffix="px" />
      </Field>
      <Field label="Zeilenhöhe (Datenzeilen)">
        <SliderInput value={project.rowHeight} onChange={(rowHeight) => onChange({ rowHeight })} min={0.6} max={1.8} step={0.05} />
      </Field>

      <SectionTitle>Anzeige</SectionTitle>
      <Toggle checked={project.showLegend} onChange={(showLegend) => onChange({ showLegend })} label="Legende anzeigen" />
      <Toggle checked={project.showKpi} onChange={(showKpi) => onChange({ showKpi })} label="KPI-Bereich anzeigen" />
      <Toggle checked={project.showSummary} onChange={(showSummary) => onChange({ showSummary })} label="Bottom Summary anzeigen" />
      <Toggle
        checked={project.showPhaseImages}
        onChange={(showPhaseImages) => onChange({ showPhaseImages })}
        label="Bilder pro Phase anzeigen"
      />
    </div>
  )
}
