import { useRef, useState } from 'react'
import { useJourneyStore } from './store/useJourneyStore'
import { JourneyCanvas } from './components/JourneyCanvas'
import { ScaledStage } from './components/ScaledStage'
import { PhaseEditor } from './components/PhaseEditor'
import { GlobalSettings } from './components/GlobalSettings'
import { Toolbar } from './components/Toolbar'
import { exportCanvas, type ExportFormat } from './utils/export'
import { exportJson, importJson } from './utils/jsonIO'

type Tab = 'phase' | 'global'

function App() {
  const {
    project,
    phases,
    kpi,
    selectedPhaseId,
    selectPhase,
    addPhase,
    removePhase,
    updatePhase,
    reorderPhases,
    updateProject,
    loadData,
    resetToDemo,
  } = useJourneyStore()

  const [tab, setTab] = useState<Tab>('phase')
  const [exporting, setExporting] = useState(false)
  const exportRef = useRef<HTMLDivElement>(null)

  const selectedPhase = phases.find((p) => p.id === selectedPhaseId) ?? null

  async function handleExport(format: ExportFormat, highRes: boolean) {
    if (!exportRef.current) return
    setExporting(true)
    try {
      await exportCanvas(exportRef.current, format, highRes, project.title)
    } catch (err) {
      console.error(err)
      alert('Export fehlgeschlagen: ' + (err as Error).message)
    } finally {
      setExporting(false)
    }
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

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      <Toolbar
        onAddPhase={addPhase}
        onExport={handleExport}
        onExportJson={() => exportJson({ project, phases, kpi }, project.title)}
        onImportJson={handleImportJson}
        onReset={resetToDemo}
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
              <PhaseEditor phase={selectedPhase} onChange={(patch) => selectedPhase && updatePhase(selectedPhase.id, patch)} />
            ) : (
              <GlobalSettings project={project} onChange={updateProject} />
            )}
          </div>
        </div>
      </div>

      {/* Hidden full-resolution copy used purely for export rendering */}
      <div style={{ position: 'fixed', top: 0, left: -100000, pointerEvents: 'none' }} aria-hidden>
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
    </div>
  )
}

export default App
