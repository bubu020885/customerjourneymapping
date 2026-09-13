import type { ProjectSettings, KpiData } from '../types'
import { Field, TextInput, TextArea, ListEditor, ColorInput, SliderInput, ImageUpload, Toggle, SectionTitle } from './ui'
import { useLang } from '../i18n'

export function GlobalSettings({
  project,
  kpi,
  onChange,
  onChangeKpi,
}: {
  project: ProjectSettings
  kpi: KpiData
  onChange: (patch: Partial<ProjectSettings>) => void
  onChangeKpi: (patch: Partial<KpiData>) => void
}) {
  const { t } = useLang()

  return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto h-full">
      <SectionTitle>{t('global.report')}</SectionTitle>

      <Field label={t('global.reportTitle')}>
        <TextInput value={project.title} onChange={(title) => onChange({ title })} />
      </Field>
      <Field label={t('global.subtitle')}>
        <TextInput value={project.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
      </Field>
      <Field label={t('global.client')}>
        <TextInput value={project.client} onChange={(client) => onChange({ client })} />
      </Field>
      <Field label={t('global.persona')}>
        <TextArea value={project.persona} onChange={(persona) => onChange({ persona })} rows={3} />
      </Field>
      <Field label={t('global.logo')}>
        <ImageUpload value={project.logo} onChange={(logo) => onChange({ logo })} label={t('global.logoUpload')} />
      </Field>

      <SectionTitle>{t('global.ciColors')}</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        <Field label={t('global.primary')}>
          <ColorInput value={project.colors.primary} onChange={(primary) => onChange({ colors: { ...project.colors, primary } })} />
        </Field>
        <Field label={t('global.secondary')}>
          <ColorInput value={project.colors.secondary} onChange={(secondary) => onChange({ colors: { ...project.colors, secondary } })} />
        </Field>
        <Field label={t('global.accent')}>
          <ColorInput value={project.colors.accent} onChange={(accent) => onChange({ colors: { ...project.colors, accent } })} />
        </Field>
        <Field label={t('global.background')}>
          <ColorInput value={project.colors.background} onChange={(background) => onChange({ colors: { ...project.colors, background } })} />
        </Field>
        <Field label={t('global.sidebarText')}>
          <ColorInput
            value={project.colors.sidebarText ?? '#ffffff'}
            onChange={(sidebarText) => onChange({ colors: { ...project.colors, sidebarText } })}
          />
        </Field>
      </div>

      <SectionTitle>{t('global.layout')}</SectionTitle>
      <Field label={t('global.fontSize')}>
        <SliderInput value={project.fontSize} onChange={(fontSize) => onChange({ fontSize })} min={10} max={20} step={0.5} suffix="px" />
      </Field>
      <Field label={t('global.cardRadius')}>
        <SliderInput value={project.cardRadius} onChange={(cardRadius) => onChange({ cardRadius })} min={0} max={28} suffix="px" />
      </Field>
      <Field label={t('global.columnGap')}>
        <SliderInput value={project.columnGap} onChange={(columnGap) => onChange({ columnGap })} min={0} max={32} suffix="px" />
      </Field>
      <Field label={t('global.rowHeight')}>
        <SliderInput value={project.rowHeight} onChange={(rowHeight) => onChange({ rowHeight })} min={0.6} max={1.8} step={0.05} />
      </Field>
      <Field label={t('global.kpiHeight')}>
        <SliderInput value={project.kpiHeight} onChange={(kpiHeight) => onChange({ kpiHeight })} min={120} max={420} step={10} suffix="px" />
      </Field>

      <SectionTitle>{t('global.display')}</SectionTitle>
      <Toggle checked={project.showKpi} onChange={(showKpi) => onChange({ showKpi })} label={t('global.showKpi')} />
      <Toggle checked={project.showSummary} onChange={(showSummary) => onChange({ showSummary })} label={t('global.showSummary')} />
      <Toggle
        checked={project.showPhaseImages}
        onChange={(showPhaseImages) => onChange({ showPhaseImages })}
        label={t('global.showPhaseImages')}
      />

      <SectionTitle>{t('global.insightSection')}</SectionTitle>
      <Field label={t('global.insightTitle')}>
        <TextInput value={kpi.insightTitle} onChange={(insightTitle) => onChangeKpi({ insightTitle })} />
      </Field>
      <Field label={t('global.insightTextField')}>
        <TextArea value={kpi.insightText} onChange={(insightText) => onChangeKpi({ insightText })} rows={4} />
      </Field>

      <SectionTitle>{t('global.kpisSection')}</SectionTitle>
      <p className="text-[11px] text-gray-400 -mt-1">{t('global.kpisNote')}</p>
      <Field label={t('global.topPainPoints')}>
        <ListEditor items={kpi.topPainPoints} onChange={(topPainPoints) => onChangeKpi({ topPainPoints })} rows={5} />
      </Field>
      <Field label={t('global.topStrengths')}>
        <ListEditor items={kpi.topStrengths} onChange={(topStrengths) => onChangeKpi({ topStrengths })} rows={4} />
      </Field>
      <Field label={t('global.topLevers')}>
        <ListEditor items={kpi.topLevers} onChange={(topLevers) => onChangeKpi({ topLevers })} rows={5} />
      </Field>
    </div>
  )
}
