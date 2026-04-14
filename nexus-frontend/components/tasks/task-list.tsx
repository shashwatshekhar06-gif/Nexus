/**
 * Task List Component - Clean Notion/Vercel Style
 */

'use client'

import { Task } from '@/types'
import { TaskCard } from './task-card'
import { ErrorMessage } from '@/components/ui/error-message'

interface TaskListProps {
  tasks: Task[]
  isLoading: boolean
  error?: any
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onRetry?: () => void
}

export function TaskList({
  tasks,
  isLoading,
  error,
  onEdit,
  onDelete,
  onRetry,
}: TaskListProps) {
  // Loading state with skeletons
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-[#111113] border border-[rgba(255,255,255,0.07)] rounded-xl p-5 animate-pulse"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="h-5 bg-[#1a1a1f] rounded w-2/3"></div>
              <div className="h-4 bg-[#1a1a1f] rounded w-12"></div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-3 bg-[#1a1a1f] rounded w-full"></div>
              <div className="h-3 bg-[#1a1a1f] rounded w-4/5"></div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="h-5 bg-[#1a1a1f] rounded w-20"></div>
              <div className="h-3 bg-[#1a1a1f] rounded w-16"></div>
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
          error={error.message || 'Failed to load tasks'}
          onRetry={onRetry}
        />
      </div>
    )
  }

  // Empty state - Clean Notion/Vercel style
  if (tasks.length === 0) {
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="text-[14px] text-[#555] mb-1">No tasks yet</h3>
        <p className="text-[12px] text-[#444]">
          Create your first task to get started
        </p>
      </div>
    )
  }

  // Tasks grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
