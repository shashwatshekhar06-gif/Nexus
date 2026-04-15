/**
 * Project Card Component - Clean Notion/Vercel Style
 */

'use client'

import { useRouter } from 'next/navigation'
import { Project } from '@/types'
import { format } from 'date-fns'

interface ProjectCardProps {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (projectId: string) => void
  isLoading?: boolean
}

export function ProjectCard({ project, onEdit, onDelete, isLoading }: ProjectCardProps) {
  const router = useRouter()

  return (
    <div className="w-full bg-[#111113] border border-[rgba(255,255,255,0.07)] rounded-xl p-6 hover:border-[rgba(255,255,255,0.14)] transition-all duration-150">
      {/* Title */}
      <h3 className="text-[15px] font-semibold text-white mb-2 break-words" style={{ fontFamily: 'Geist, sans-serif', fontWeight: 600 }}>
        {project.name}
      </h3>

      {/* Description */}
      <p className="text-[12px] text-[#666] mb-4 line-clamp-2 min-h-[2.5rem] break-words">
        {project.description || 'No description provided'}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mb-4">
        {/* Status chip */}
        <div className="bg-[#1a1a1f] px-2 py-1 rounded text-[11px] text-[#888]">
          {project.status}
        </div>
        
        {/* Date */}
        <div className="text-[11px] text-[#444]">
          {format(new Date(project.createdAt), 'MMM d, yyyy')}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2 pt-4 border-t border-[rgba(255,255,255,0.06)]">
        <button
          onClick={() => router.push(`/projects/${project.id}/tasks`)}
          disabled={isLoading}
          className="w-full px-3 py-2 text-[13px] font-medium text-white bg-[#6c5ce7] rounded-[6px] hover:bg-[#7c6dfa] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          View Tasks
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(project)}
            disabled={isLoading}
            className="flex-1 px-3 py-2 text-[12px] font-medium text-[#888] bg-[#0f0f10] rounded-[6px] hover:bg-[#1a1a1f] hover:text-white transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(project.id)}
            disabled={isLoading}
            className="flex-1 px-3 py-2 text-[12px] font-medium text-[#ef4444] bg-[rgba(239,68,68,0.08)] rounded-[6px] hover:bg-[rgba(239,68,68,0.12)] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
