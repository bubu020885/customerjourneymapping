import type { Phase, Emotion } from '../types'
import { EMOTION_META } from '../types'
import { Field, TextInput, ListEditor, ColorInput, SliderInput, Select, ImageUpload, SectionTitle } from './ui'

const EMOTION_OPTIONS: { value: Emotion; label: string }[] = (
  ['sehr positiv', 'positiv', 'neutral', 'negativ', 'kritisch'] as Emotion[]
).map((e) => ({ value: e, label: `${EMOTION_META[e].emoji} ${EMOTION_META[e].label}` }))

export function PhaseEditor({ phase, onChange }: { phase: Phase | null; onChange: (patch: Partial<Phase>) => void }) {
  if (!phase) {
    return (
      <div className="p-6 text-sm text-gray-400 text-center">Wähle eine Phase im Journey Canvas aus, um sie zu bearbeiten.</div>
    )
  }

  return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto h-full">
      <SectionTitle>Phase {phase.number} bearbeiten</SectionTitle>

      <Field label="Phasentitel">
        <TextInput value={phase.title} onChange={(title) => onChange({ title })} />
      </Field>

      <Field label="Untertitel / Zeitraum">
        <TextInput value={phase.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
      </Field>

      <Field label="Kurzbeschreibung">
        <ListEditor items={[phase.description]} onChange={([description]) => onChange({ description: description ?? '' })} rows={2} />
      </Field>

      <Field label="Einstiegsbild">
        <ImageUpload value={phase.image} onChange={(image) => onChange({ image })} />
      </Field>

      <div className="grid grid-cols-3 gap-2">
        <Field label="Hintergrund">
          <ColorInput value={phase.color} onChange={(color) => onChange({ color })} />
        </Field>
        <Field label="Akzent">
          <ColorInput value={phase.accent} onChange={(accent) => onChange({ accent })} />
        </Field>
        <Field label="Text">
          <ColorInput value={phase.textColor} onChange={(textColor) => onChange({ textColor })} />
        </Field>
      </div>

      <SectionTitle>Inhalte</SectionTitle>

      <Field label="Ziele & Bedürfnisse (eine Zeile je Eintrag)">
        <ListEditor items={phase.goals} onChange={(goals) => onChange({ goals })} />
      </Field>

      <Field label="Touchpoints">
        <ListEditor items={phase.touchpoints} onChange={(touchpoints) => onChange({ touchpoints })} />
      </Field>

      <div className="grid grid-cols-2 gap-2 items-start">
        <Field label="Emotionaler Zustand">
          <Select value={phase.emotion} onChange={(emotion) => onChange({ emotion })} options={EMOTION_OPTIONS} />
        </Field>
        <Field label="Erlebnis-Score (1–10)">
          <SliderInput value={phase.score} onChange={(score) => onChange({ score })} min={1} max={10} step={0.5} />
        </Field>
      </div>

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
