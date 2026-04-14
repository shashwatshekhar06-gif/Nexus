'use client'

/**
 * Tasks Page - Clean Notion/Vercel Style
 */

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTasks } from '@/hooks/use-tasks'
import { useProjects } from '@/hooks/use-projects'
import { TaskList } from '@/components/tasks/task-list'
import { TaskFilters } from '@/components/tasks/task-filters'
import { TaskForm } from '@/components/tasks/task-form'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Task, TaskFormData, TaskStatus, TaskPriority } from '@/types'

export default function TasksPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string

  const [filters, setFilters] = useState<{
    status?: TaskStatus
    priority?: TaskPriority
  }>({})

  const { tasks, isLoading, error, mutate, createTask, updateTask, deleteTask } = useTasks({ projectId })
  const { projects } = useProjects({ page: 1, limit: 100 })

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  // Get current project
  const currentProject = projects.find((p) => p.id === projectId)

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filters.status && task.status !== filters.status) return false
    if (filters.priority && task.priority !== filters.priority) return false
    return true
  })

  // Handle filter changes
  const handleFilterChange = (newFilters: { status?: TaskStatus; priority?: TaskPriority }) => {
    setFilters(newFilters)
  }

  // Handle task creation
  const handleCreate = async (data: TaskFormData) => {
    try {
      setActionError(null)
      await createTask(data)
      setIsCreateModalOpen(false)
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to create task')
      throw err
    }
  }

  // Handle task edit
  const handleEdit = (task: Task) => {
    setSelectedTask(task)
    setIsEditModalOpen(true)
    setActionError(null)
  }

  const handleUpdate = async (data: TaskFormData) => {
    if (!selectedTask) return

    try {
      setActionError(null)
      await updateTask(selectedTask.id, data)
      setIsEditModalOpen(false)
      setSelectedTask(null)
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to update task')
      throw err
    }
  }

  // Handle task deletion
  const handleDeleteClick = (taskId: string) => {
    setDeleteConfirmId(taskId)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return

    try {
      setIsDeleting(true)
      setActionError(null)
      await deleteTask(deleteConfirmId)
      setDeleteConfirmId(null)
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to delete task')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null)
  }

  return (
    <div className="space-y-6">
      {/* Header with Project Name and Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/projects')}
            className="text-[#555] hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-[18px] font-semibold text-white" style={{ fontFamily: 'Geist, sans-serif', fontWeight: 600 }}>
              {currentProject?.name || 'Project Tasks'}
            </h1>
            <p className="text-[12px] text-[#555]">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </p>
          </div>
        </div>
        
        {/* Create Button */}
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
          Create Task
        </Button>
      </div>

      {/* Filters */}
      <TaskFilters
        onFilterChange={handleFilterChange}
        currentStatus={filters.status}
        currentPriority={filters.priority}
      />

      {/* Error message */}
      {actionError && (
        <div className="bg-[#111113] border border-[rgba(239,68,68,0.3)] rounded-[10px] p-4">
          <div className="flex items-start justify-between">
            <p className="text-[13px] text-[#ef4444]">{actionError}</p>
            <button
              onClick={() => setActionError(null)}
              className="text-[#ef4444] hover:text-[#dc2626] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <TaskList
        tasks={filteredTasks}
        isLoading={isLoading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onRetry={() => mutate()}
      />

      {/* Modals */}
      <Modal isOpen={isCreateModalOpen} onClose={() => { setIsCreateModalOpen(false); setActionError(null) }} title="Create New Task">
        <TaskForm onSubmit={handleCreate} onCancel={() => { setIsCreateModalOpen(false); setActionError(null) }} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedTask(null); setActionError(null) }} title="Edit Task">
        {selectedTask && (
          <TaskForm task={selectedTask} onSubmit={handleUpdate} onCancel={() => { setIsEditModalOpen(false); setSelectedTask(null); setActionError(null) }} />
        )}
      </Modal>

      <Modal isOpen={!!deleteConfirmId} onClose={handleDeleteCancel} title="Delete Task">
        <div className="space-y-4">
          <p className="text-[13px] text-[#888]">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
          <div className="flex items-center gap-3 pt-4">
            <Button variant="danger" onClick={handleDeleteConfirm} disabled={isDeleting} className="flex-1">
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
            <Button variant="secondary" onClick={handleDeleteCancel} disabled={isDeleting} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
