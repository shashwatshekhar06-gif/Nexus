'use client'

/**
 * Projects Page - Clean Notion/Vercel Style
 */

import React, { useState } from 'react'
import { useProjects } from '@/hooks/use-projects'
import { ProjectList } from '@/components/projects/project-list'
import { ProjectFilters } from '@/components/projects/project-filters'
import { ProjectForm } from '@/components/projects/project-form'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Project, ProjectFormData } from '@/types'

export default function ProjectsPage() {
  const [filters, setFilters] = useState<{
    status?: 'ACTIVE' | 'ARCHIVED'
    search?: string
    page: number
    limit: number
  }>({
    page: 1,
    limit: 9,
  })

  const { projects, meta, isLoading, error, mutate, createProject, updateProject, deleteProject } =
    useProjects(filters)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  // Handle filter changes
  const handleFilterChange = (newFilters: { status?: 'ACTIVE' | 'ARCHIVED'; search?: string }) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }))
  }

  // Handle project creation
  const handleCreate = async (data: ProjectFormData) => {
    try {
      setActionError(null)
      await createProject(data)
      setIsCreateModalOpen(false)
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to create project')
      throw err
    }
  }

  // Handle project edit
  const handleEdit = (project: Project) => {
    setSelectedProject(project)
    setIsEditModalOpen(true)
    setActionError(null)
  }

  const handleUpdate = async (data: ProjectFormData) => {
    if (!selectedProject) return

    try {
      setActionError(null)
      await updateProject(selectedProject.id, data)
      setIsEditModalOpen(false)
      setSelectedProject(null)
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to update project')
      throw err
    }
  }

  // Handle project deletion
  const handleDeleteClick = (projectId: string) => {
    setDeleteConfirmId(projectId)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return

    try {
      setIsDeleting(true)
      setActionError(null)
      await deleteProject(deleteConfirmId)
      setDeleteConfirmId(null)
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to delete project')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null)
  }

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Create Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search projects..."
            className="w-[320px] h-9 px-3 bg-[#111113] border border-[rgba(255,255,255,0.08)] rounded-[6px] text-white placeholder-[#444] text-[12px] focus:outline-none focus:ring-2 focus:ring-[rgba(124,109,250,0.3)] focus:border-[rgba(124,109,250,0.3)] transition-all duration-150"
            onChange={(e) => handleFilterChange({ search: e.target.value })}
          />
          
          {/* Filter Pills */}
          <ProjectFilters onFilterChange={handleFilterChange} currentStatus={filters.status} />
        </div>
        
        {/* Create Button */}
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
          Create Project
        </Button>
      </div>

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

      {/* Projects List */}
      <ProjectList
        projects={projects}
        isLoading={isLoading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onRetry={() => mutate()}
      />

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between bg-[#111113] border border-[rgba(255,255,255,0.08)] rounded-[10px] p-4">
          <div className="text-[12px] text-[#666]">
            Page {meta.page} of {meta.totalPages} ({meta.total} total)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page === meta.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={isCreateModalOpen} onClose={() => { setIsCreateModalOpen(false); setActionError(null) }} title="Create New Project">
        <ProjectForm onSubmit={handleCreate} onCancel={() => { setIsCreateModalOpen(false); setActionError(null) }} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedProject(null); setActionError(null) }} title="Edit Project">
        {selectedProject && (
          <ProjectForm project={selectedProject} onSubmit={handleUpdate} onCancel={() => { setIsEditModalOpen(false); setSelectedProject(null); setActionError(null) }} />
        )}
      </Modal>

      <Modal isOpen={!!deleteConfirmId} onClose={handleDeleteCancel} title="Delete Project">
        <div className="space-y-4">
          <p className="text-[13px] text-[#888]">
            Are you sure you want to delete this project? This action cannot be undone.
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