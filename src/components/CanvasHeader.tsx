import { Users } from 'lucide-react'
import type { ProjectSettings } from '../types'
import { HEADER_H } from '../layoutConstants'

export function CanvasHeader({ project }: { project: ProjectSettings }) {
  return (
    <div
      className="flex items-stretch gap-4 px-5 shrink-0"
      style={{ height: HEADER_H, background: project.colors.background, borderBottom: `3px solid ${project.colors.accent}` }}
    >
      <div className="flex items-center gap-3 shrink-0">
        {project.logo ? (
          <img src={project.logo} alt="Logo" className="h-14 w-auto object-contain" />
        ) : (
          <div
            className="h-14 w-14 rounded flex items-center justify-center font-black text-white shrink-0"
            style={{ background: project.colors.primary, fontSize: 22 }}
          >
            {project.client?.[0]?.toUpperCase() ?? 'A'}
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center min-w-0 flex-1">
        <h1
          className="font-black uppercase leading-tight truncate"
          style={{ fontSize: project.fontSize * 2.1, color: project.colors.primary, letterSpacing: 0.5 }}
        >
          {project.title}
        </h1>
        <p className="uppercase font-medium truncate" style={{ fontSize: project.fontSize * 0.95, color: project.colors.secondary }}>
          {project.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0 max-w-[420px] border-l pl-4" style={{ borderColor: '#e5e7eb' }}>
        <Users size={project.fontSize * 1.8} style={{ color: project.colors.primary }} className="shrink-0" />
        <div className="min-w-0">
          <div className="font-bold uppercase truncate" style={{ fontSize: project.fontSize * 0.8, color: project.colors.primary }}>
            {project.client || 'Testpersona'}
          </div>
          <div className="line-clamp-2" style={{ fontSize: project.fontSize * 0.62, color: '#6b7280', lineHeight: 1.25 }}>
            {project.persona}
          </div>
        </div>
      </div>
    </div>
  )
}
