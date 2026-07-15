import { Plus, Trash2 } from 'lucide-react'
import type { Phase, Emotion, ProjectSettings } from '../types'
import { EMOTION_META, DEFAULT_BODY_TEXT_COLOR, DEFAULT_PAIN_POINT_COLOR, DEFAULT_OPPORTUNITY_COLOR } from '../types'
import { Field, TextInput, ListEditor, ColorInput, SliderInput, Select, ImageUpload, SectionTitle } from './ui'

const EMOTION_OPTIONS: { value: Emotion; label: string }[] = (
  ['sehr positiv', 'positiv', 'neutral', 'negativ', 'kritisch'] as Emotion[]
).map((e) => ({ value: e, label: `${EMOTION_META[e].emoji} ${EMOTION_META[e].label}` }))

export function PhaseEditor({
  phase,
  phaseCount,
  project,
  onChange,
  onDelete,
  onInsertAfter,
}: {
  phase: Phase | null
  phaseCount: number
  project: ProjectSettings
  onChange: (patch: Partial<Phase>) => void
  onDelete: () => void
  onInsertAfter: () => void
}) {
  if (!phase) {
    return (
      <div className="p-6 text-sm text-gray-400 text-center">Wähle eine Phase im Journey Canvas aus, um sie zu bearbeiten.</div>
    )
  }

  return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto h-full">
      <SectionTitle>Phase {phase.number} bearbeiten</SectionTitle>

      <div className="flex gap-2">
        <button
          onClick={onInsertAfter}
          className="flex flex-1 items-center justify-center gap-1 rounded-md border border-gray-300 px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          <Plus size={14} /> Phase danach einfügen
        </button>
        <button
          onClick={() => {
            if (phaseCount <= 1) return
            if (confirm(`Phase "${phase.title}" wirklich löschen?`)) onDelete()
          }}
          disabled={phaseCount <= 1}
          title={phaseCount <= 1 ? 'Die letzte Phase kann nicht gelöscht werden' : undefined}
          className="flex flex-1 items-center justify-center gap-1 rounded-md border border-red-200 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <Trash2 size={14} /> Phase löschen
        </button>
      </div>

      <Field label="Phasentitel">
        <TextInput value={phase.title} onChange={(title) => onChange({ title })} />
      </Field>

      <Field label="Untertitel / Zeitraum">
        <TextInput value={phase.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
      </Field>

      <Field label="Kurzbeschreibung">
        <ListEditor items={[phase.description]} onChange={([description]) => onChange({ description: description ?? '' })} rows={2} />
      </Field>

      {project.showPhaseImages ? (
        <Field label="Einstiegsbild">
          <ImageUpload value={phase.image} onChange={(image) => onChange({ image })} />
        </Field>
      ) : (
        <p className="text-xs text-gray-400">
          Bilder sind global deaktiviert. Aktiviere sie unter „Globale Einstellungen" → „Anzeige", um ein Einstiegsbild zu hinterlegen.
        </p>
      )}

      <SectionTitle>Kartenfarben</SectionTitle>
      <Field label="Hintergrund">
        <ColorInput value={phase.color} onChange={(color) => onChange({ color })} />
      </Field>
      <Field label="Akzent">
        <ColorInput value={phase.accent} onChange={(accent) => onChange({ accent })} />
      </Field>
      <Field label="Titeltext (im Kartenkopf)">
        <ColorInput value={phase.textColor} onChange={(textColor) => onChange({ textColor })} />
      </Field>

      <SectionTitle>Textfarben (Inhalte)</SectionTitle>
      <Field label="Standardtext (Ziele, Touchpoints)">
        <ColorInput value={phase.bodyTextColor ?? DEFAULT_BODY_TEXT_COLOR} onChange={(bodyTextColor) => onChange({ bodyTextColor })} />
      </Field>
      <Field label="Pain Points">
        <ColorInput value={phase.painPointColor ?? DEFAULT_PAIN_POINT_COLOR} onChange={(painPointColor) => onChange({ painPointColor })} />
      </Field>
      <Field label="Opportunities">
        <ColorInput
          value={phase.opportunityColor ?? DEFAULT_OPPORTUNITY_COLOR}
          onChange={(opportunityColor) => onChange({ opportunityColor })}
        />
      </Field>
      <Field label="Handlungsempfehlungen">
        <ColorInput
          value={phase.recommendationColor ?? '#ea943f'}
          onChange={(recommendationColor) => onChange({ recommendationColor })}
        />
      </Field>

      <SectionTitle>Inhalte</SectionTitle>

      <Field label="Ziele & Bedürfnisse (eine Zeile je Eintrag)">
        <ListEditor items={phase.goals} onChange={(goals) => onChange({ goals })} />
      </Field>

      <Field label="Touchpoints">
        <ListEditor items={phase.touchpoints} onChange={(touchpoints) => onChange({ touchpoints })} />
      </Field>

      <Field label="Emotionaler Zustand">
        <Select value={phase.emotion} onChange={(emotion) => onChange({ emotion })} options={EMOTION_OPTIONS} />
      </Field>
      <Field label="Erlebnis-Score (1–10)">
        <SliderInput value={phase.score} onChange={(score) => onChange({ score })} min={1} max={10} step={0.5} />
      </Field>

      <Field label="Pain Points">
        <ListEditor items={phase.painPoints} onChange={(painPoints) => onChange({ painPoints })} />
      </Field>

      <Field label="Opportunities / Chancen">
        <ListEditor items={phase.opportunities} onChange={(opportunities) => onChange({ opportunities })} />
      </Field>

      <Field label="Handlungsempfehlungen">
        <ListEditor items={phase.recommendations} onChange={(recommendations) => onChange({ recommendations })} />
      </Field>
    </div>
  )
}
