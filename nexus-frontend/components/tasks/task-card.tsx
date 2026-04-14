/**
 * Task Card Component - Clean Notion/Vercel Style
 */

'use client'

import { Task } from '@/types'
import { format } from 'date-fns'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  isLoading?: boolean
}

const statusColors = {
  TODO: 'bg-[#1a1a1f] text-[#888]',
  IN_PROGRESS: 'bg-[rgba(108,92,231,0.1)] text-[#7c6dfa]',
  IN_REVIEW: 'bg-[rgba(251,191,36,0.1)] text-[#fbbf24]',
  DONE: 'bg-[rgba(34,197,94,0.1)] text-[#22c55e]',
}

const priorityColors = {
  LOW: 'text-[#666]',
  MEDIUM: 'text-[#888]',
  HIGH: 'text-[#fbbf24]',
  URGENT: 'text-[#ef4444]',
}

export function TaskCard({ task, onEdit, onDelete, isLoading }: TaskCardProps) {
  return (
    <div className="bg-[#111113] border border-[rgba(255,255,255,0.07)] rounded-xl p-5 hover:border-[rgba(255,255,255,0.14)] hover:-translate-y-0.5 transition-all duration-150">
      {/* Title and Priority */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-[15px] font-semibold text-white flex-1" style={{ fontFamily: 'Geist, sans-serif', fontWeight: 600 }}>
          {task.title}
        </h3>
        <span className={`text-[11px] font-medium ml-2 ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {/* Description */}
      <p className="text-[12px] text-[#666] mb-4 line-clamp-2 min-h-[2.5rem]">
        {task.description || 'No description provided'}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mb-4">
        {/* Status chip */}
        <div className={`px-2 py-1 rounded text-[11px] ${statusColors[task.status]}`}>
          {task.status.replace('_', ' ')}
        </div>
        
        {/* Due date */}
        {task.dueDate && (
          <div className="text-[11px] text-[#444]">
            Due {format(new Date(task.dueDate), 'MMM d')}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-4 border-t border-[rgba(255,255,255,0.06)]">
        <button
          onClick={() => onEdit(task)}
          disabled={isLoading}
          className="flex-1 px-3 py-1.5 text-[12px] font-medium text-[#888] bg-[#0f0f10] rounded-[6px] hover:bg-[#1a1a1f] hover:text-white transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          disabled={isLoading}
          className="flex-1 px-3 py-1.5 text-[12px] font-medium text-[#ef4444] bg-[rgba(239,68,68,0.08)] rounded-[6px] hover:bg-[rgba(239,68,68,0.12)] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
