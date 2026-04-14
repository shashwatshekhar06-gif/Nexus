'use client'

/**
 * Project Filters Component - Clean pill style
 */

interface ProjectFiltersProps {
  onFilterChange: (filters: { status?: 'ACTIVE' | 'ARCHIVED'; search?: string }) => void
  currentStatus?: 'ACTIVE' | 'ARCHIVED'
}

export function ProjectFilters({ onFilterChange, currentStatus }: ProjectFiltersProps) {
  const filters = [
    { label: 'ALL', value: undefined },
    { label: 'ACTIVE', value: 'ACTIVE' as const },
    { label: 'ARCHIVED', value: 'ARCHIVED' as const },
  ]

  return (
    <div className="flex items-center gap-2">
      {filters.map((filter) => (
        <button
          key={filter.label}
          onClick={() => onFilterChange({ status: filter.value })}
          className={`px-3 h-9 text-[12px] font-medium rounded-[6px] transition-all duration-150 ${
            currentStatus === filter.value
              ? 'bg-[#1a1a1f] text-white'
              : 'bg-transparent text-[#444] hover:text-white'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
