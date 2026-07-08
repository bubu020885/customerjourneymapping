import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import type { JourneyMapData, Phase, ProjectSettings, KpiData } from '../types'
import { demoData } from '../data/demoData'

const PALETTE = ['#74486E', '#5B6EAE', '#3E8E8E', '#2E6F6F', '#3E7A4F', '#C97A2B', '#2A8FAE', '#7C8C3E', '#8A3B3B']

interface JourneyState {
  project: ProjectSettings
  phases: Phase[]
  kpi: KpiData
  selectedPhaseId: string | null

  selectPhase: (id: string | null) => void
  addPhase: () => void
  removePhase: (id: string) => void
  updatePhase: (id: string, patch: Partial<Phase>) => void
  reorderPhases: (activeId: string, overId: string) => void
  updateProject: (patch: Partial<ProjectSettings>) => void
  updateKpi: (patch: Partial<KpiData>) => void
  loadData: (data: JourneyMapData) => void
  resetToDemo: () => void
}

function renumber(phases: Phase[]): Phase[] {
  return phases.map((p, i) => ({ ...p, number: i + 1 }))
}

export const useJourneyStore = create<JourneyState>()(
  persist(
    (set, get) => ({
      project: demoData.project,
      phases: demoData.phases,
      kpi: demoData.kpi,
      selectedPhaseId: demoData.phases[0]?.id ?? null,

      selectPhase: (id) => set({ selectedPhaseId: id }),

      addPhase: () => {
        const phases = get().phases
        const color = PALETTE[phases.length % PALETTE.length]
        const newPhase: Phase = {
          id: uuid(),
          number: phases.length + 1,
          title: 'Neue Phase',
          subtitle: 'Zeitraum',
          image: '',
          color,
          accent: '#ffca19',
          textColor: '#ffffff',
          description: '',
          goals: [],
          touchpoints: [],
          emotion: 'neutral',
          score: 5,
          painPoints: [],
          opportunities: [],
          recommendations: [],
        }
        set({ phases: [...phases, newPhase], selectedPhaseId: newPhase.id })
      },

      removePhase: (id) => {
        const phases = renumber(get().phases.filter((p) => p.id !== id))
        const selectedPhaseId = get().selectedPhaseId === id ? (phases[0]?.id ?? null) : get().selectedPhaseId
        set({ phases, selectedPhaseId })
      },

      updatePhase: (id, patch) => {
        set({ phases: get().phases.map((p) => (p.id === id ? { ...p, ...patch } : p)) })
      },

      reorderPhases: (activeId, overId) => {
        const phases = [...get().phases]
        const from = phases.findIndex((p) => p.id === activeId)
        const to = phases.findIndex((p) => p.id === overId)
        if (from === -1 || to === -1 || from === to) return
        const [moved] = phases.splice(from, 1)
        phases.splice(to, 0, moved)
        set({ phases: renumber(phases) })
      },

      updateProject: (patch) => set({ project: { ...get().project, ...patch } }),
      updateKpi: (patch) => set({ kpi: { ...get().kpi, ...patch } }),

      loadData: (data) =>
        set({
          project: data.project,
          phases: data.phases,
          kpi: data.kpi,
          selectedPhaseId: data.phases[0]?.id ?? null,
        }),

      resetToDemo: () =>
        set({
          project: demoData.project,
          phases: demoData.phases,
          kpi: demoData.kpi,
          selectedPhaseId: demoData.phases[0]?.id ?? null,
        }),
    }),
    { name: 'journey-map-storage' },
  ),
)
