import { createContext, useContext, useState, type ReactNode } from 'react'

export type Lang = 'de' | 'en'

const STORAGE_KEY = 'cjm-lang'

function detectLang(): Lang {
  if (typeof navigator === 'undefined') return 'de'
  const nav = navigator.language || (navigator as unknown as { userLanguage?: string }).userLanguage || ''
  return nav.toLowerCase().startsWith('en') ? 'en' : 'de'
}

const de = {
  'app.tabPhase': 'Phase bearbeiten',
  'app.tabGlobal': 'Globale Einstellungen',
  'app.exportFailed': 'Export fehlgeschlagen: ',
  'app.jsonImportFailed': 'JSON konnte nicht geladen werden: ',

  'header.title': 'Customer Journey Mapping',
  'header.tagline': 'Amusement Business Support',
  'header.info': 'Info',
  'header.allTools': '↗ Alle Tools',
  'header.modalTitle': 'Customer Journey Mapping Tool',
  'header.about': 'Über dieses Tool',
  'header.aboutText':
    'Bilde die Customer Journey deiner Gäste Phase für Phase ab – mit Zielen, Touchpoints, Emotionen, Erlebnis-Score, Pain Points, Opportunities und Handlungsempfehlungen. Im Präsentationsmodus stellst du die Ergebnisse direkt im 16:9-Format vor und exportierst alles als PNG, JPG oder PDF.',
  'header.aboutMaker': 'Über den Macher',
  'header.aboutMakerText':
    'über 20 Jahre Erfahrung in der Freizeitbranche: Betrieb, Personalentwicklung und Guest Experience. LeisureWorkspace macht dieses Praxiswissen als digitale Tools für andere Fachleute zugänglich.',
  'header.footerAllTools': 'Alle Tools ↗',

  'mobile.title': 'Nur auf dem Desktop verfügbar',
  'mobile.text':
    'Das Customer Journey Mapping Tool ist für die Bearbeitung am großen Bildschirm konzipiert. Die Nutzung ist aktuell nur auf einem Desktop- oder Laptop-Computer möglich.',
  'mobile.back': '← Zur Hauptseite',

  'toolbar.title': 'Journey Map Builder',
  'toolbar.addPhase': 'Phase hinzufügen',
  'toolbar.highRes': 'Hochauflösend (3840×2160)',
  'toolbar.jsonExport': 'JSON exportieren',
  'toolbar.jsonImport': 'JSON importieren',
  'toolbar.startPresentation': 'Präsentation starten',
  'toolbar.exporting': 'Export läuft…',

  'editor.selectPhase': 'Wähle eine Phase im Journey Canvas aus, um sie zu bearbeiten.',
  'editor.editPhase': 'Phase {n} bearbeiten',
  'editor.insertAfter': 'Phase danach einfügen',
  'editor.deletePhase': 'Phase löschen',
  'editor.deleteConfirm': 'Phase "{title}" wirklich löschen?',
  'editor.deleteLastDisabled': 'Die letzte Phase kann nicht gelöscht werden',
  'editor.title': 'Phasentitel',
  'editor.subtitle': 'Untertitel / Zeitraum',
  'editor.description': 'Kurzbeschreibung',
  'editor.entryImage': 'Einstiegsbild',
  'editor.imagesDisabledNote': 'Bilder sind global deaktiviert. Aktiviere sie unter „Globale Einstellungen" → „Anzeige", um ein Einstiegsbild zu hinterlegen.',
  'editor.presentationMode': 'Präsentationsmodus',
  'editor.presentationPhotos': 'Präsentationsfotos (bis zu {n})',
  'editor.presentationPhotosNote': 'Diese Fotos werden nur im Präsentationsmodus angezeigt – ideal für Eindrücke, die dem Kunden direkt gezeigt werden sollen.',
  'editor.cardColors': 'Kartenfarben',
  'editor.background': 'Hintergrund',
  'editor.accent': 'Akzent',
  'editor.titleTextColor': 'Titeltext (im Kartenkopf)',
  'editor.contentTextColors': 'Textfarben (Inhalte)',
  'editor.bodyText': 'Standardtext (Ziele, Touchpoints)',
  'editor.painPoints': 'Pain Points',
  'editor.opportunities': 'Opportunities',
  'editor.recommendations': 'Handlungsempfehlungen',
  'editor.content': 'Inhalte',
  'editor.goals': 'Ziele & Bedürfnisse (eine Zeile je Eintrag)',
  'editor.touchpoints': 'Touchpoints',
  'editor.emotion': 'Emotionaler Zustand',
  'editor.score': 'Erlebnis-Score (1–10)',
  'editor.opportunitiesChances': 'Opportunities / Chancen',

  'global.report': 'Report',
  'global.reportTitle': 'Report-Titel',
  'global.subtitle': 'Untertitel',
  'global.client': 'Kunde / Projektname',
  'global.persona': 'Testpersona / Zielgruppe',
  'global.logo': 'Logo',
  'global.logoUpload': 'Logo hochladen oder hierher ziehen',
  'global.ciColors': 'CI-Farben',
  'global.primary': 'Primärfarbe',
  'global.secondary': 'Sekundärfarbe',
  'global.accent': 'Akzentfarbe',
  'global.background': 'Hintergrundfarbe',
  'global.sidebarText': 'Sidebar-Text (Zeilenbeschriftungen)',
  'global.layout': 'Layout',
  'global.fontSize': 'Schriftgröße',
  'global.cardRadius': 'Kartenrundung',
  'global.columnGap': 'Spaltenabstand',
  'global.rowHeight': 'Zeilenhöhe (Datenzeilen)',
  'global.kpiHeight': 'Höhe KPI-Bereich',
  'global.display': 'Anzeige',
  'global.showKpi': 'KPI-Bereich anzeigen',
  'global.showSummary': 'Bottom Summary anzeigen',
  'global.showPhaseImages': 'Bilder pro Phase anzeigen',
  'global.insightSection': 'Overall Journey Insight',
  'global.insightTitle': 'Titel',
  'global.insightTextField': 'Text',
  'global.kpisSection': 'KPIs',
  'global.kpisNote': 'Der Erlebnis-Score wird automatisch als Durchschnitt der Erlebnis-Scores aller Phasen berechnet – kein manueller Eintrag nötig.',
  'global.topPainPoints': 'Top 5 Pain Points (eine Zeile je Eintrag)',
  'global.topStrengths': 'Top Stärken',
  'global.topLevers': 'Größte Hebel',

  'canvas.testPersona': 'Testpersona',

  'rowLabel.phases': 'PHASEN',
  'rowLabel.goals': 'Ziele & Bedürfnisse',
  'rowLabel.touchpoints': 'Touchpoints',
  'rowLabel.emotion': 'Emotionen',
  'rowLabel.score': 'Erlebnis (Score)',
  'rowLabel.painPoints': 'Pain Points',
  'rowLabel.opportunities': 'Opportunities',
  'rowLabel.recommendations': 'Handlungsempfehlungen',

  'phaseColumn.move': 'Verschieben',
  'phaseColumn.delete': 'Phase löschen',

  'stage.zoomOut': 'Verkleinern',
  'stage.zoomIn': 'Vergrößern',
  'stage.fitView': 'Ansicht einpassen',
  'stage.panHint': 'Ziehen oder Scrollen zum Verschieben · Strg + Scrollen zum Zoomen',

  'kpi.experienceScore': 'Erlebnis-Score',
  'kpi.avgAllPhases': 'Ø aller Phasen',
  'kpi.emotionalJourneyScore': 'Emotional Journey Score',
  'kpi.topPainPoints': 'Top 5 Pain Points',
  'kpi.topStrengths': 'Top Stärken',
  'kpi.topLevers': 'Größte Hebel',

  'presentation.mode': 'Präsentationsmodus',
  'presentation.prevSlide': 'Vorherige Folie',
  'presentation.nextSlide': 'Nächste Folie',
  'presentation.exportPdf': 'Als PDF exportieren',
  'presentation.exporting': 'Export läuft…',
  'presentation.controlsHint': 'Steuerung: ← → · Esc zum Beenden',
  'presentation.exit': 'Beenden',
  'presentation.summary': 'Zusammenfassung',
  'presentation.part': 'Teil {p}/2',
  'presentation.slideOf': 'Folie {p}/2',
  'presentation.phaseCounter': 'Phase {i} / {n} · Folie {p}/2',

  'slide.goals': 'Ziele & Bedürfnisse',
  'slide.touchpoints': 'Touchpoints',
  'slide.painPoints': 'Pain Points',
  'slide.opportunities': 'Opportunities',
  'slide.recommendations': 'Handlungsempfehlungen',
  'slide.noPhotos': 'Keine Fotos hinterlegt',
  'slide.experienceScore': 'Erlebnis-Score',
  'slide.avgExperienceScore': 'Erlebnis-Score (Ø)',
  'slide.avgAllPhases': 'Ø aller Phasen',
  'slide.summary': 'Zusammenfassung',
  'slide.overallInsightFallback': 'Overall Journey Insight',
  'slide.topPainPoints': 'Top Pain Points',
  'slide.topStrengths': 'Top Stärken',
  'slide.topLevers': 'Größte Hebel',

  'export.ready': 'Export bereit',
  'export.hint': 'Falls der Download nicht automatisch gestartet ist (z. B. in einer eingebetteten Vorschau), nutze einen der Links unten.',
  'export.previewAlt': 'Export-Vorschau',
  'export.filename': 'Datei:',
  'export.download': 'Datei herunterladen',
  'export.openNewTab': 'In neuem Tab öffnen',

  'ui.uploadImageDefault': 'Bild hochladen oder hierher ziehen',
  'ui.dropImageHere': 'Bild hier loslassen',
  'ui.remove': 'Entfernen',
  'ui.removePhoto': 'Foto entfernen',
  'ui.dropHere': 'Loslassen',
  'ui.addPhoto': 'Foto hinzufügen',

  'emotion.verzaubert': 'Verzaubert',
  'emotion.sehr positiv': 'Sehr positiv',
  'emotion.positiv': 'Positiv',
  'emotion.überrascht': 'Überrascht',
  'emotion.neutral': 'Neutral',
  'emotion.verwirrt': 'Verwirrt',
  'emotion.negativ': 'Negativ',
  'emotion.verärgert': 'Verärgert',
  'emotion.kritisch': 'Kritisch',
}

const en: typeof de = {
  'app.tabPhase': 'Edit phase',
  'app.tabGlobal': 'Global settings',
  'app.exportFailed': 'Export failed: ',
  'app.jsonImportFailed': 'Could not load JSON: ',

  'header.title': 'Customer Journey Mapping',
  'header.tagline': 'Amusement Business Support',
  'header.info': 'Info',
  'header.allTools': '↗ All Tools',
  'header.modalTitle': 'Customer Journey Mapping Tool',
  'header.about': 'About this tool',
  'header.aboutText':
    "Map your guests' customer journey phase by phase — with goals, touchpoints, emotions, experience score, pain points, opportunities and recommendations. In presentation mode you can walk clients through the results directly in 16:9 format and export everything as PNG, JPG or PDF.",
  'header.aboutMaker': 'About the maker',
  'header.aboutMakerText':
    '20+ years of experience in the leisure attraction industry: operations, people development and guest experience. LeisureWorkspace turns that practical knowledge into digital tools for other industry professionals.',
  'header.footerAllTools': 'All Tools ↗',

  'mobile.title': 'Desktop only',
  'mobile.text':
    'The Customer Journey Mapping Tool is designed for editing on a large screen. It can currently only be used on a desktop or laptop computer.',
  'mobile.back': '← Back to homepage',

  'toolbar.title': 'Journey Map Builder',
  'toolbar.addPhase': 'Add phase',
  'toolbar.highRes': 'High resolution (3840×2160)',
  'toolbar.jsonExport': 'Export JSON',
  'toolbar.jsonImport': 'Import JSON',
  'toolbar.startPresentation': 'Start presentation',
  'toolbar.exporting': 'Exporting…',

  'editor.selectPhase': 'Select a phase in the journey canvas to edit it.',
  'editor.editPhase': 'Edit phase {n}',
  'editor.insertAfter': 'Insert phase after',
  'editor.deletePhase': 'Delete phase',
  'editor.deleteConfirm': 'Really delete phase "{title}"?',
  'editor.deleteLastDisabled': 'The last phase cannot be deleted',
  'editor.title': 'Phase title',
  'editor.subtitle': 'Subtitle / timeframe',
  'editor.description': 'Short description',
  'editor.entryImage': 'Cover image',
  'editor.imagesDisabledNote': 'Images are disabled globally. Enable them under "Global settings" → "Display" to add a cover image.',
  'editor.presentationMode': 'Presentation mode',
  'editor.presentationPhotos': 'Presentation photos (up to {n})',
  'editor.presentationPhotosNote': "These photos only show up in presentation mode — ideal for impressions you want to show the client directly.",
  'editor.cardColors': 'Card colors',
  'editor.background': 'Background',
  'editor.accent': 'Accent',
  'editor.titleTextColor': 'Title text (card header)',
  'editor.contentTextColors': 'Text colors (content)',
  'editor.bodyText': 'Default text (goals, touchpoints)',
  'editor.painPoints': 'Pain points',
  'editor.opportunities': 'Opportunities',
  'editor.recommendations': 'Recommendations',
  'editor.content': 'Content',
  'editor.goals': 'Goals & needs (one line per entry)',
  'editor.touchpoints': 'Touchpoints',
  'editor.emotion': 'Emotional state',
  'editor.score': 'Experience score (1–10)',
  'editor.opportunitiesChances': 'Opportunities',

  'global.report': 'Report',
  'global.reportTitle': 'Report title',
  'global.subtitle': 'Subtitle',
  'global.client': 'Client / project name',
  'global.persona': 'Test persona / target audience',
  'global.logo': 'Logo',
  'global.logoUpload': 'Upload logo or drag it here',
  'global.ciColors': 'Brand colors',
  'global.primary': 'Primary color',
  'global.secondary': 'Secondary color',
  'global.accent': 'Accent color',
  'global.background': 'Background color',
  'global.sidebarText': 'Sidebar text (row labels)',
  'global.layout': 'Layout',
  'global.fontSize': 'Font size',
  'global.cardRadius': 'Card corner radius',
  'global.columnGap': 'Column spacing',
  'global.rowHeight': 'Row height (data rows)',
  'global.kpiHeight': 'KPI section height',
  'global.display': 'Display',
  'global.showKpi': 'Show KPI section',
  'global.showSummary': 'Show bottom summary',
  'global.showPhaseImages': 'Show image per phase',
  'global.insightSection': 'Overall Journey Insight',
  'global.insightTitle': 'Title',
  'global.insightTextField': 'Text',
  'global.kpisSection': 'KPIs',
  'global.kpisNote': "The experience score is calculated automatically as the average of all phases' experience scores – no manual entry needed.",
  'global.topPainPoints': 'Top 5 pain points (one line per entry)',
  'global.topStrengths': 'Top strengths',
  'global.topLevers': 'Biggest levers',

  'canvas.testPersona': 'Test persona',

  'rowLabel.phases': 'PHASES',
  'rowLabel.goals': 'Goals & Needs',
  'rowLabel.touchpoints': 'Touchpoints',
  'rowLabel.emotion': 'Emotions',
  'rowLabel.score': 'Experience (Score)',
  'rowLabel.painPoints': 'Pain Points',
  'rowLabel.opportunities': 'Opportunities',
  'rowLabel.recommendations': 'Recommendations',

  'phaseColumn.move': 'Move',
  'phaseColumn.delete': 'Delete phase',

  'stage.zoomOut': 'Zoom out',
  'stage.zoomIn': 'Zoom in',
  'stage.fitView': 'Fit to view',
  'stage.panHint': 'Drag or scroll to pan · Ctrl + scroll to zoom',

  'kpi.experienceScore': 'Experience Score',
  'kpi.avgAllPhases': 'Avg. of all phases',
  'kpi.emotionalJourneyScore': 'Emotional Journey Score',
  'kpi.topPainPoints': 'Top 5 Pain Points',
  'kpi.topStrengths': 'Top Strengths',
  'kpi.topLevers': 'Biggest Levers',

  'presentation.mode': 'Presentation mode',
  'presentation.prevSlide': 'Previous slide',
  'presentation.nextSlide': 'Next slide',
  'presentation.exportPdf': 'Export as PDF',
  'presentation.exporting': 'Exporting…',
  'presentation.controlsHint': 'Controls: ← → · Esc to exit',
  'presentation.exit': 'Exit',
  'presentation.summary': 'Summary',
  'presentation.part': 'Part {p}/2',
  'presentation.slideOf': 'Slide {p}/2',
  'presentation.phaseCounter': 'Phase {i} / {n} · Slide {p}/2',

  'slide.goals': 'Goals & Needs',
  'slide.touchpoints': 'Touchpoints',
  'slide.painPoints': 'Pain Points',
  'slide.opportunities': 'Opportunities',
  'slide.recommendations': 'Recommendations',
  'slide.noPhotos': 'No photos added',
  'slide.experienceScore': 'Experience Score',
  'slide.avgExperienceScore': 'Experience Score (avg.)',
  'slide.avgAllPhases': 'Avg. of all phases',
  'slide.summary': 'Summary',
  'slide.overallInsightFallback': 'Overall Journey Insight',
  'slide.topPainPoints': 'Top Pain Points',
  'slide.topStrengths': 'Top Strengths',
  'slide.topLevers': 'Biggest Levers',

  'export.ready': 'Export ready',
  'export.hint': "If the download didn't start automatically (e.g. in an embedded preview), use one of the links below.",
  'export.previewAlt': 'Export preview',
  'export.filename': 'File:',
  'export.download': 'Download file',
  'export.openNewTab': 'Open in new tab',

  'ui.uploadImageDefault': 'Upload image or drag it here',
  'ui.dropImageHere': 'Drop image here',
  'ui.remove': 'Remove',
  'ui.removePhoto': 'Remove photo',
  'ui.dropHere': 'Drop here',
  'ui.addPhoto': 'Add photo',

  'emotion.verzaubert': 'Enchanted',
  'emotion.sehr positiv': 'Very positive',
  'emotion.positiv': 'Positive',
  'emotion.überrascht': 'Surprised',
  'emotion.neutral': 'Neutral',
  'emotion.verwirrt': 'Confused',
  'emotion.negativ': 'Negative',
  'emotion.verärgert': 'Annoyed',
  'emotion.kritisch': 'Critical',
}

export type TranslationKey = keyof typeof de

const translations: Record<Lang, Record<TranslationKey, string>> = { de, en }

function format(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match))
}

interface LangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  /** Accepts any TranslationKey, plus plain strings for dynamically-built keys (e.g. `emotion.${value}`). */
  t: (key: TranslationKey | (string & {}), vars?: Record<string, string | number>) => string
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'de' || stored === 'en') return stored
    } catch {
      /* localStorage unavailable */
    }
    return detectLang()
  })

  function setLang(l: Lang) {
    setLangState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* localStorage unavailable */
    }
  }

  function t(key: string, vars?: Record<string, string | number>): string {
    const k = key as TranslationKey
    return format(translations[lang][k] ?? translations.de[k] ?? key, vars)
  }

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
