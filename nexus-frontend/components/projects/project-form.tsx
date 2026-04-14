/**
 * Project Form Component - Clean Notion/Vercel Style
 */

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Project, ProjectFormData } from '@/types'
import { Button } from '@/components/ui/button'

// Validation schema
const projectSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must not exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
  status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
})

interface ProjectFormProps {
  project?: Project
  onSubmit: (data: ProjectFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function ProjectForm({ project, onSubmit, onCancel, isLoading }: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: project
      ? {
          name: project.name,
          description: project.description || '',
          status: project.status,
        }
      : {
          name: '',
          description: '',
          status: 'ACTIVE',
        },
  })

  const handleFormSubmit = async (data: ProjectFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Project Name */}
      <div>
        <label htmlFor="name" className="block text-[13px] font-medium text-[#888] mb-2">
          Project Name <span className="text-[#ef4444]">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="w-full px-3 py-2 bg-[#0f0f10] border border-[rgba(255,255,255,0.08)] rounded-[6px] text-white placeholder-[#444] text-[13px] focus:outline-none focus:ring-2 focus:ring-[rgba(124,109,250,0.3)] focus:border-[rgba(124,109,250,0.3)] transition-all duration-150"
          placeholder="Enter project name"
        />
        {errors.name && (
          <p className="mt-1.5 text-[12px] text-[#ef4444]">{errors.name.message}</p>
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
          placeholder="Enter project description (optional)"
        />
        {errors.description && (
          <p className="mt-1.5 text-[12px] text-[#ef4444]">{errors.description.message}</p>
        )}
      </div>

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
          <option value="ACTIVE">Active</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        {errors.status && (
          <p className="mt-1.5 text-[12px] text-[#ef4444]">{errors.status.message}</p>
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
              {project ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            <>{project ? 'Update Project' : 'Create Project'}</>
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
