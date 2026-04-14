/**
 * Task Filters Component - Clean Notion/Vercel Style
 */

'use client'

import { TaskStatus, TaskPriority } from '@/types'

interface TaskFiltersProps {
  onFilterChange: (filters: { status?: TaskStatus; priority?: TaskPriority }) => void
  currentStatus?: TaskStatus
  currentPriority?: TaskPriority
}

export function TaskFilters({ onFilterChange, currentStatus, currentPriority }: TaskFiltersProps) {
  const statuses: (TaskStatus | undefined)[] = [undefined, 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']
  const priorities: (TaskPriority | undefined)[] = [undefined, 'LOW', 'MEDIUM', 'HIGH', 'URGENT']

  const statusLabels = {
    undefined: 'ALL',
    TODO: 'TO DO',
    IN_PROGRESS: 'IN PROGRESS',
    IN_REVIEW: 'IN REVIEW',
    DONE: 'DONE',
  }

  const priorityLabels = {
    undefined: 'ALL',
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    URGENT: 'URGENT',
  }

  return (
    <div className="flex items-center gap-4">
      {/* Status Filters */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-[#555] uppercase tracking-wide">Status:</span>
        <div className="flex items-center gap-1">
          {statuses.map((status) => (
            <button
              key={status || 'all'}
              onClick={() => onFilterChange({ status, priority: currentPriority })}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-[6px] transition-all duration-150 ${
                currentStatus === status
                  ? 'bg-[#1a1a1f] text-white'
                  : 'text-[#555] hover:text-[#888] hover:bg-[#0f0f10]'
              }`}
            >
              {statusLabels[status as keyof typeof statusLabels]}
            </button>
          ))}
        </div>
      </div>

      {/* Priority Filters */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-[#555] uppercase tracking-wide">Priority:</span>
        <div className="flex items-center gap-1">
          {priorities.map((priority) => (
            <button
              key={priority || 'all'}
              onClick={() => onFilterChange({ status: currentStatus, priority })}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-[6px] transition-all duration-150 ${
                currentPriority === priority
                  ? 'bg-[#1a1a1f] text-white'
                  : 'text-[#555] hover:text-[#888] hover:bg-[#0f0f10]'
              }`}
            >
              {priorityLabels[priority as keyof typeof priorityLabels]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
