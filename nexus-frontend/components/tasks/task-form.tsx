/**
 * Task Form Component - Clean Notion/Vercel Style
 */

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Task, TaskFormData } from '@/types'
import { Button } from '@/components/ui/button'

// Validation schema
const taskSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),
  description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .optional()
    .or(z.literal('')),
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  dueDate: z.string().optional().or(z.literal('')),
  assigneeId: z.string().optional().or(z.literal('')),
})

interface TaskFormProps {
  task?: Task
  onSubmit: (data: TaskFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function TaskForm({ task, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description || '',
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
          assigneeId: task.assigneeId || '',
        }
      : {
          title: '',
          description: '',
          status: 'TODO',
          priority: 'MEDIUM',
          dueDate: '',
          assigneeId: '',
        },
  })

  const handleFormSubmit = async (data: TaskFormData) => {
    try {
      // Clean up empty strings
      const cleanData = {
        ...data,
        description: data.description || undefined,
        dueDate: data.dueDate || undefined,
        assigneeId: data.assigneeId || undefined,
      }
      await onSubmit(cleanData)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Task Title */}
      <div>
        <label htmlFor="title" className="block text-[13px] font-medium text-[#888] mb-2">
          Task Title <span className="text-[#ef4444]">*</span>
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="w-full px-3 py-2 bg-[#0f0f10] border border-[rgba(255,255,255,0.08)] rounded-[6px] text-white placeholder-[#444] text-[13px] focus:outline-none focus:ring-2 focus:ring-[rgba(124,109,250,0.3)] focus:border-[rgba(124,109,250,0.3)] transition-all duration-150"
          placeholder="Enter task title"
        />
        {errors.title && (
          <p className="mt-1.5 text-[12px] text-[#ef4444]">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-[13px] font-medium text-[#888] mb-2">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={4}
          className="w-full px-3 py-2 bg-[#0f0f10] border border-[rgba(255,255,255,0.08)] rounded-[6px] text-white placeholder-[#444] text-[13px] focus:outline-none focus:ring-2 focus:ring-[rgba(124,109,250,0.3)] focus:border-[rgba(124,109,250,0.3)] transition-all duration-150 resize-none"
          placeholder="Enter task description (optional)"
        />
        {errors.description && (
          <p className="mt-1.5 text-[12px] text-[#ef4444]">{errors.description.message}</p>
        )}
      </div>

      {/* Status and Priority Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-[13px] font-medium text-[#888] mb-2">
            Status
          </label>
          <select
            id="status"
            {...register('status')}
            className="w-full px-3 py-2 bg-[#0f0f10] border border-[rgba(255,255,255,0.08)] rounded-[6px] text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-[rgba(124,109,250,0.3)] focus:border-[rgba(124,109,250,0.3)] transition-all duration-150"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block text-[13px] font-medium text-[#888] mb-2">
            Priority
          </label>
          <select
            id="priority"
            {...register('priority')}
            className="w-full px-3 py-2 bg-[#0f0f10] border border-[rgba(255,255,255,0.08)] rounded-[6px] text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-[rgba(124,109,250,0.3)] focus:border-[rgba(124,109,250,0.3)] transition-all duration-150"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label htmlFor="dueDate" className="block text-[13px] font-medium text-[#888] mb-2">
          Due Date
        </label>
        <input
          id="dueDate"
          type="date"
          {...register('dueDate')}
          className="w-full px-3 py-2 bg-[#0f0f10] border border-[rgba(255,255,255,0.08)] rounded-[6px] text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-[rgba(124,109,250,0.3)] focus:border-[rgba(124,109,250,0.3)] transition-all duration-150"
        />
        {errors.dueDate && (
          <p className="mt-1.5 text-[12px] text-[#ef4444]">{errors.dueDate.message}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || isLoading}
          className="flex-1"
        >
          {isSubmitting || isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {task ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            <>{task ? 'Update Task' : 'Create Task'}</>
          )}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting || isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
