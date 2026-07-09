import type { JourneyMapData } from '../types'

export const emptyProject: JourneyMapData = {
  project: {
    title: 'Customer Journey Map',
    subtitle: '',
    client: '',
    persona: '',
    logo: '',
    colors: {
      primary: '#2b1b3d',
      secondary: '#ea943f',
      accent: '#ffca19',
      background: '#ffffff',
      sidebarText: '#ffffff',
    },
    fontSize: 14,
    cardRadius: 12,
    columnGap: 10,
    rowHeight: 1,
    showLegend: true,
    showKpi: true,
    showSummary: true,
  },
  phases: [],
  kpi: {
    insightTitle: 'Overall Journey Insight',
    insightText: '',
    guestEffortScore: 0,
    topPainPoints: [],
    topStrengths: [],
    topLevers: [],
  },
}
