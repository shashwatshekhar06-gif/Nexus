/**
 * Tasks Hook - Data fetching and mutations for tasks
 */

import useSWR from 'swr'
import { apiClient } from '@/lib/api-client'
import { Task, TaskFormData } from '@/types'

interface UseTasksOptions {
  projectId: string
}

export function useTasks({ projectId }: UseTasksOptions) {
  const { data, error, isLoading, mutate } = useSWR<Task[]>(
    projectId ? `/projects/${projectId}/tasks` : null,
    async (url) => {
      const response = await apiClient.get(url)
      return response.data.data || []
    }
  )

  const createTask = async (data: TaskFormData) => {
    const response = await apiClient.post(`/projects/${projectId}/tasks`, data)
    await mutate()
    return response.data.data
  }

  const updateTask = async (taskId: string, data: TaskFormData) => {
    const response = await apiClient.patch(`/projects/${projectId}/tasks/${taskId}`, data)
    await mutate()
    return response.data.data
  }

  const deleteTask = async (taskId: string) => {
    await apiClient.delete(`/projects/${projectId}/tasks/${taskId}`)
    await mutate()
  }

  return {
    tasks: data || [],
    isLoading,
    error,
    mutate,
    createTask,
    updateTask,
    deleteTask,
  }
}
