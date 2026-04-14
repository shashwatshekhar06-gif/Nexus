/**
 * Project List Component - Clean Notion/Vercel Style
 */

'use client'

import { Project } from '@/types'
import { ProjectCard } from './project-card'
import { ErrorMessage } from '@/components/ui/error-message'

interface ProjectListProps {
  projects: Project[]
  isLoading: boolean
  error?: any
  onEdit: (project: Project) => void
  onDelete: (projectId: string) => void
  onRetry?: () => void
}

export function ProjectList({
  projects,
  isLoading,
  error,
  onEdit,
  onDelete,
  onRetry,
}: ProjectListProps) {
  // Loading state with skeletons
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-[#111113] border border-[rgba(255,255,255,0.07)] rounded-xl p-5 animate-pulse"
          >
            <div className="h-5 bg-[#1a1a1f] rounded w-2/3 mb-2"></div>
            <div className="space-y-2 mb-4">
              <div className="h-3 bg-[#1a1a1f] rounded w-full"></div>
              <div className="h-3 bg-[#1a1a1f] rounded w-4/5"></div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="h-5 bg-[#1a1a1f] rounded w-16"></div>
              <div className="h-3 bg-[#1a1a1f] rounded w-20"></div>
            </div>
            <div className="flex gap-2 pt-4 border-t border-[rgba(255,255,255,0.06)]">
              <div className="h-7 bg-[#1a1a1f] rounded flex-1"></div>
              <div className="h-7 bg-[#1a1a1f] rounded flex-1"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-[#111113] border border-[rgba(255,255,255,0.08)] rounded-xl p-12">
        <ErrorMessage
          error={error.message || 'Failed to load projects'}
          onRetry={onRetry}
        />
      </div>
    )
  }

  // Empty state - Clean Notion/Vercel style
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg
          className="w-8 h-8 text-[#333] mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
        <h3 className="text-[14px] text-[#555] mb-1">No projects yet</h3>
        <p className="text-[12px] text-[#444]">
          Create your first project to get started
        </p>
      </div>
    )
  }

  // Projects grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
