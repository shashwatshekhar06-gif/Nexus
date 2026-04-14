/**
 * Projects Data Fetching Hook
 * 
 * Custom hook for fetching and managing projects data using SWR.
 * Provides caching, revalidation, and mutation functions for projects.
 */

'use client'

import useSWR from 'swr'
import { apiClient } from '@/lib/api-client'
import { Project, ProjectFormData, ApiSuccessResponse, PaginationMeta } from '@/types'
import { useAuth } from './use-auth'

interface ProjectFilters {
  status?: 'ACTIVE' | 'ARCHIVED'
  search?: string
  page?: number
  limit?: number
}

interface UseProjectsReturn {
  projects: Project[]
  meta?: PaginationMeta
  isLoading: boolean
  error: any
  mutate: () => void
  createProject: (data: ProjectFormData) => Promise<Project>
  updateProject: (id: string, data: ProjectFormData) => Promise<Project>
  deleteProject: (id: string) => Promise<void>
}

/**
 * Fetcher function for SWR
 */
const fetcher = async (url: string): Promise<ApiSuccessResponse<Project[]>> => {
  const response = await apiClient.get(url)
  return response.data
}

/**
 * Hook for fetching and managing projects
 */
export function useProjects(filters?: ProjectFilters): UseProjectsReturn {
  const { isAuthenticated } = useAuth()

  // Build query string from filters
  const queryParams = new URLSearchParams()
  if (filters?.status) queryParams.append('status', filters.status)
  if (filters?.search) queryParams.append('search', filters.search)
  if (filters?.page) queryParams.append('page', filters.page.toString())
  if (filters?.limit) queryParams.append('limit', filters.limit.toString())

  const queryString = queryParams.toString()
  const endpoint = `/projects${queryString ? `?${queryString}` : ''}`

  // Only fetch if user is authenticated
  const { data, error, mutate, isLoading } = useSWR(
    isAuthenticated ? endpoint : null,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    }
  )

  /**
   * Create a new project
   */
  const createProject = async (projectData: ProjectFormData): Promise<Project> => {
    const response = await apiClient.post<ApiSuccessResponse<Project>>(
      '/projects',
      projectData
    )
    
    // Revalidate cache after mutation
    await mutate()
    
    return response.data.data
  }

  /**
   * Update an existing project
   */
  const updateProject = async (
    id: string,
    projectData: ProjectFormData
  ): Promise<Project> => {
    const response = await apiClient.patch<ApiSuccessResponse<Project>>(
      `/projects/${id}`,
      projectData
    )
    
    // Revalidate cache after mutation
    await mutate()
    
    return response.data.data
  }

  /**
   * Delete a project
   */
  const deleteProject = async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`)
    
    // Revalidate cache after mutation
    await mutate()
  }

  return {
    projects: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    mutate,
    createProject,
    updateProject,
    deleteProject,
  }
}
