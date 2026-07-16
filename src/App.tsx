import { useRef, useState } from 'react'
import { useJourneyStore } from './store/useJourneyStore'
import { JourneyCanvas } from './components/JourneyCanvas'
import { ScaledStage } from './components/ScaledStage'
import { PhaseEditor } from './components/PhaseEditor'
import { GlobalSettings } from './components/GlobalSettings'
import { Toolbar } from './components/Toolbar'
import { ExportResultModal } from './components/ExportResultModal'
import { PresentationView } from './components/PresentationView'
import { PresentationSlide } from './components/PresentationSlide'
import { generateExport, generatePresentationExport, tryAutoDownload, type ExportFormat, type ExportResult } from './utils/export'
import { generateJsonExport, importJson } from './utils/jsonIO'

type Tab = 'phase' | 'global'

function App() {
  const {
    project,
    phases,
    kpi,
    selectedPhaseId,
    selectPhase,
    addPhase,
    insertPhaseAfter,
    removePhase,
    updatePhase,
    reorderPhases,
    updateProject,
    updateKpi,
    loadData,
  } = useJourneyStore()

  const [tab, setTab] = useState<Tab>('phase')
  const [exporting, setExporting] = useState(false)
  const [exportResult, setExportResult] = useState<ExportResult | null>(null)
  const exportRef = useRef<HTMLDivElement>(null)

  const [presentationMode, setPresentationMode] = useState(false)
  const [presentationSlideIndex, setPresentationSlideIndex] = useState(0)
  const [presentationExporting, setPresentationExporting] = useState(false)
  const presentationExportRefs = useRef<(HTMLDivElement | null)[]>([])

  const selectedPhase = phases.find((p) => p.id === selectedPhaseId) ?? null

  async function handleExport(format: ExportFormat, highRes: boolean) {
    if (!exportRef.current) return
    setExporting(true)
    try {
      const result = await generateExport(exportRef.current, format, highRes, project.title)
      tryAutoDownload(result)
      setExportResult(result)
    } catch (err) {
      console.error(err)
      alert('Export fehlgeschlagen: ' + (err as Error).message)
    } finally {
      setExporting(false)
    }
  }

  function handleExportJson() {
    const result = generateJsonExport({ project, phases, kpi }, project.title)
    tryAutoDownload(result)
    setExportResult(result)
  }

  function closeExportResult() {
    if (exportResult) URL.revokeObjectURL(exportResult.url)
    setExportResult(null)
  }

  async function handleImportJson(file: File) {
    try {
      const data = await importJson(file)
      loadData(data)
    } catch (err) {
      alert('JSON konnte nicht geladen werden: ' + (err as Error).message)
    }
  }

  function handleSelectPhase(id: string) {
    selectPhase(id)
    setTab('phase')
  }

  function startPresentation() {
    setPresentationSlideIndex(0)
    setPresentationMode(true)
  }

  async function handleExportPresentation() {
    const nodes = presentationExportRefs.current.filter((n): n is HTMLDivElement => n !== null)
    setPresentationExporting(true)
    try {
      const result = await generatePresentationExport(nodes, project.title)
      tryAutoDownload(result)
      setExportResult(result)
    } catch (err) {
      console.error(err)
      alert('Export fehlgeschlagen: ' + (err as Error).message)
    } finally {
      setPresentationExporting(false)
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      <Toolbar
        onAddPhase={addPhase}
        onExport={handleExport}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onStartPresentation={startPresentation}
        exporting={exporting}
      />

      <div className="flex flex-1 min-h-0">
        <div className="flex-1 min-w-0 p-4">
          <ScaledStage>
            <JourneyCanvas
              project={project}
              phases={phases}
              kpi={kpi}
              selectedPhaseId={selectedPhaseId}
              editable
              onSelectPhase={handleSelectPhase}
              onDeletePhase={removePhase}
              onReorder={reorderPhases}
            />
          </ScaledStage>
        </div>

        <div className="w-96 shrink-0 border-l border-gray-200 bg-white flex flex-col">
          <div className="flex border-b border-gray-200 shrink-0">
            <button
              onClick={() => setTab('phase')}
              className={`flex-1 py-2.5 text-sm font-semibold ${tab === 'phase' ? 'text-gray-900 border-b-2 border-amber-500' : 'text-gray-400'}`}
            >
              Phase bearbeiten
            </button>
            <button
              onClick={() => setTab('global')}
              className={`flex-1 py-2.5 text-sm font-semibold ${tab === 'global' ? 'text-gray-900 border-b-2 border-amber-500' : 'text-gray-400'}`}
            >
              Globale Einstellungen
            </button>
          </div>
          <div className="flex-1 min-h-0">
            {tab === 'phase' ? (
              <PhaseEditor
                phase={selectedPhase}
                phaseCount={phases.length}
                project={project}
                onChange={(patch) => selectedPhase && updatePhase(selectedPhase.id, patch)}
                onDelete={() => selectedPhase && removePhase(selectedPhase.id)}
                onInsertAfter={() => selectedPhase && insertPhaseAfter(selectedPhase.id)}
              />
            ) : (
              <GlobalSettings project={project} kpi={kpi} onChange={updateProject} onChangeKpi={updateKpi} />
            )}
          </div>
        </div>
      </div>

      {/*
        Hidden full-resolution copy used purely for export rendering.
        Kept in normal document flow (not an extreme off-screen fixed offset) and merely
        clipped by a 1x1 overflow-hidden wrapper: some sandboxed/embedded browser contexts
        skip painting elements placed far outside the viewport via `position: fixed`, which
        silently produced blank exports. A same-flow clipped box is rendered reliably everywhere.
      */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1, overflow: 'hidden', pointerEvents: 'none' }} aria-hidden>
        <JourneyCanvas
          ref={exportRef}
          project={project}
          phases={phases}
          kpi={kpi}
          selectedPhaseId={null}
          editable={false}
          onSelectPhase={() => {}}
          onDeletePhase={() => {}}
          onReorder={() => {}}
        />
      </div>

      {/* Hidden full-resolution copies of every presentation slide, used purely for the
          multi-page PDF export. Kept in normal document flow for the same reason as the
          main export container above (see comment there). */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1, overflow: 'hidden', pointerEvents: 'none' }} aria-hidden>
        {phases.map((phase, i) =>
          ([1, 2] as const).map((part) => (
            <PresentationSlide
              key={`${phase.id}-${part}`}
              ref={(el) => {
                presentationExportRefs.current[i * 2 + (part - 1)] = el
              }}
              phase={phase}
              project={project}
              part={part}
              phaseIndex={i}
              phaseCount={phases.length}
            />
          )),
        )}
      </div>

      {presentationMode && (
        <PresentationView
          phases={phases}
          project={project}
          slideIndex={presentationSlideIndex}
          onSlideIndexChange={setPresentationSlideIndex}
          onExit={() => setPresentationMode(false)}
          onExportPdf={handleExportPresentation}
          exporting={presentationExporting}
        />
      )}

      {exportResult && <ExportResultModal result={exportResult} onClose={closeExportResult} />}
    </div>
  )
}

export default App
