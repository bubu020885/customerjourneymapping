import { forwardRef } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import type { Phase, ProjectSettings, KpiData } from '../types'
import { CANVAS_W, CANVAS_H } from '../layoutConstants'
import { CanvasHeader } from './CanvasHeader'
import { RowLabelsColumn } from './RowLabelsColumn'
import { PhaseColumn } from './PhaseColumn'
import { EmotionCurve } from './EmotionCurve'
import { ScoreCurve } from './ScoreCurve'
import { KpiDashboard } from './KpiDashboard'

interface Props {
  project: ProjectSettings
  phases: Phase[]
  kpi: KpiData
  selectedPhaseId: string | null
  editable: boolean
  onSelectPhase: (id: string) => void
  onDeletePhase: (id: string) => void
  onReorder: (activeId: string, overId: string) => void
}

export const JourneyCanvas = forwardRef<HTMLDivElement, Props>(function JourneyCanvas(
  { project, phases, kpi, selectedPhaseId, editable, onSelectPhase, onDeletePhase, onReorder },
  ref,
) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      onReorder(String(active.id), String(over.id))
    }
  }

  return (
    <div
      ref={ref}
      data-journey-canvas
      className="flex flex-col overflow-hidden select-none"
      style={{
        width: CANVAS_W,
        height: CANVAS_H,
        background: project.colors.background,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <CanvasHeader project={project} />

      <div className="relative flex flex-1 min-h-0">
        <RowLabelsColumn project={project} />

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={phases.map((p) => p.id)} strategy={horizontalListSortingStrategy}>
            <div className="relative flex flex-1 min-w-0" style={{ gap: project.columnGap, zIndex: 2 }}>
              {phases.map((phase) => (
                <PhaseColumn
                  key={phase.id}
                  phase={phase}
                  project={project}
                  selected={phase.id === selectedPhaseId}
                  onSelect={() => onSelectPhase(phase.id)}
                  onDelete={() => onDeletePhase(phase.id)}
                  editable={editable}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <EmotionCurve phases={phases} project={project} />
        <ScoreCurve phases={phases} project={project} />
      </div>

      <KpiDashboard kpi={kpi} phases={phases} project={project} />
    </div>
  )
})
