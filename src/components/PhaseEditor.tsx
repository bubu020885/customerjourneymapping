import { Plus, Trash2 } from 'lucide-react'
import type { Phase, ProjectSettings } from '../types'
import { EMOTION_META, EMOTION_ORDER, DEFAULT_BODY_TEXT_COLOR, DEFAULT_PAIN_POINT_COLOR, DEFAULT_OPPORTUNITY_COLOR, MAX_PRESENTATION_PHOTOS } from '../types'
import { Field, TextInput, ListEditor, ColorInput, SliderInput, Select, ImageUpload, PhotoGridUpload, SectionTitle } from './ui'
import { useLang } from '../i18n'

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
  const { t } = useLang()

  const emotionOptions = [...EMOTION_ORDER]
    .reverse()
    .map((e) => ({ value: e, label: `${EMOTION_META[e].emoji} ${t(`emotion.${e}`)}` }))

  if (!phase) {
    return <div className="p-6 text-sm text-gray-400 text-center">{t('editor.selectPhase')}</div>
  }

  return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto h-full">
      <SectionTitle>{t('editor.editPhase', { n: phase.number })}</SectionTitle>

      <div className="flex gap-2">
        <button
          onClick={onInsertAfter}
          className="flex flex-1 items-center justify-center gap-1 rounded-md border border-gray-300 px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          <Plus size={14} /> {t('editor.insertAfter')}
        </button>
        <button
          onClick={() => {
            if (phaseCount <= 1) return
            if (confirm(t('editor.deleteConfirm', { title: phase.title }))) onDelete()
          }}
          disabled={phaseCount <= 1}
          title={phaseCount <= 1 ? t('editor.deleteLastDisabled') : undefined}
          className="flex flex-1 items-center justify-center gap-1 rounded-md border border-red-200 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <Trash2 size={14} /> {t('editor.deletePhase')}
        </button>
      </div>

      <Field label={t('editor.title')}>
        <TextInput value={phase.title} onChange={(title) => onChange({ title })} />
      </Field>

      <Field label={t('editor.subtitle')}>
        <TextInput value={phase.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
      </Field>

      <Field label={t('editor.description')}>
        <ListEditor items={[phase.description]} onChange={([description]) => onChange({ description: description ?? '' })} rows={2} />
      </Field>

      {project.showPhaseImages ? (
        <Field label={t('editor.entryImage')}>
          <ImageUpload value={phase.image} onChange={(image) => onChange({ image })} label={t('ui.uploadImageDefault')} />
        </Field>
      ) : (
        <p className="text-xs text-gray-400">{t('editor.imagesDisabledNote')}</p>
      )}

      <SectionTitle>{t('editor.presentationMode')}</SectionTitle>
      <Field label={t('editor.presentationPhotos', { n: MAX_PRESENTATION_PHOTOS })}>
        <PhotoGridUpload photos={phase.photos ?? []} onChange={(photos) => onChange({ photos })} max={MAX_PRESENTATION_PHOTOS} />
      </Field>
      <p className="text-[11px] text-gray-400 -mt-2">{t('editor.presentationPhotosNote')}</p>

      <SectionTitle>{t('editor.cardColors')}</SectionTitle>
      <Field label={t('editor.background')}>
        <ColorInput value={phase.color} onChange={(color) => onChange({ color })} />
      </Field>
      <Field label={t('editor.accent')}>
        <ColorInput value={phase.accent} onChange={(accent) => onChange({ accent })} />
      </Field>
      <Field label={t('editor.titleTextColor')}>
        <ColorInput value={phase.textColor} onChange={(textColor) => onChange({ textColor })} />
      </Field>

      <SectionTitle>{t('editor.contentTextColors')}</SectionTitle>
      <Field label={t('editor.bodyText')}>
        <ColorInput value={phase.bodyTextColor ?? DEFAULT_BODY_TEXT_COLOR} onChange={(bodyTextColor) => onChange({ bodyTextColor })} />
      </Field>
      <Field label={t('editor.painPoints')}>
        <ColorInput value={phase.painPointColor ?? DEFAULT_PAIN_POINT_COLOR} onChange={(painPointColor) => onChange({ painPointColor })} />
      </Field>
      <Field label={t('editor.opportunities')}>
        <ColorInput
          value={phase.opportunityColor ?? DEFAULT_OPPORTUNITY_COLOR}
          onChange={(opportunityColor) => onChange({ opportunityColor })}
        />
      </Field>
      <Field label={t('editor.recommendations')}>
        <ColorInput
          value={phase.recommendationColor ?? '#ea943f'}
          onChange={(recommendationColor) => onChange({ recommendationColor })}
        />
      </Field>

      <SectionTitle>{t('editor.content')}</SectionTitle>

      <Field label={t('editor.goals')}>
        <ListEditor items={phase.goals} onChange={(goals) => onChange({ goals })} />
      </Field>

      <Field label={t('editor.touchpoints')}>
        <ListEditor items={phase.touchpoints} onChange={(touchpoints) => onChange({ touchpoints })} />
      </Field>

      <Field label={t('editor.emotion')}>
        <Select value={phase.emotion} onChange={(emotion) => onChange({ emotion })} options={emotionOptions} />
      </Field>
      <Field label={t('editor.score')}>
        <SliderInput value={phase.score} onChange={(score) => onChange({ score })} min={1} max={10} step={0.5} />
      </Field>

      <Field label={t('editor.painPoints')}>
        <ListEditor items={phase.painPoints} onChange={(painPoints) => onChange({ painPoints })} />
      </Field>

      <Field label={t('editor.opportunitiesChances')}>
        <ListEditor items={phase.opportunities} onChange={(opportunities) => onChange({ opportunities })} />
      </Field>

      <Field label={t('editor.recommendations')}>
        <ListEditor items={phase.recommendations} onChange={(recommendations) => onChange({ recommendations })} />
      </Field>
    </div>
  )
}
