'use client'

/**
 * Dashboard Home Page - Clean Notion/Vercel Style
 */

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { apiClient } from '@/lib/api-client'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ totalProjects: 0, totalTasks: 0 })
  const [isLoading, setIsLoading] = useState(true)
  
  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }
  
  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch projects
        const projectsRes = await apiClient.get('/projects?limit=1')
        
        // Try to fetch tasks, but don't fail if endpoint doesn't exist
        let tasksTotal = 0
        try {
          const tasksRes = await apiClient.get('/tasks?limit=1')
          tasksTotal = tasksRes.data.meta?.total || 0
        } catch {
          // Tasks endpoint not implemented yet, keep as 0
        }
        
        setStats({
          totalProjects: projectsRes.data.meta?.total || 0,
          totalTasks: tasksTotal
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchStats()
  }, [])
  
  return (
    <div className="flex min-h-[calc(100vh-120px)] w-full justify-center">
      <section className="flex w-full max-w-[740px] flex-col items-center justify-center gap-8">
      <div className="space-y-3 text-center">
        <p className="text-sm font-medium text-[#888]">{getGreeting()}, {user?.name}</p>
        <h1
          className="text-3xl font-semibold text-white"
          style={{ fontFamily: 'Geist, sans-serif' }}
        >
          Your Nexus Dashboard
        </h1>
      </div>

      <div className="grid w-full grid-cols-1 justify-items-center gap-5 md:grid-cols-2">
        <div className="flex h-56 w-full max-w-[360px] flex-col items-center justify-center rounded-[8px] border border-white/[0.08] bg-[#111113] p-7 text-center shadow-xl shadow-black/20 transition-colors hover:border-[rgba(124,109,250,0.28)]">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[8px] bg-[rgba(124,109,250,0.12)]">
            <svg className="h-5 w-5 text-[rgba(124,109,250,0.75)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-[#a1a1aa]">Total Projects</p>
          <p className="mt-3 text-5xl font-semibold text-white" style={{ fontFamily: 'Geist, sans-serif' }}>
            {isLoading ? '-' : stats.totalProjects}
          </p>
        </div>

        <Link href="/tasks" className="flex h-56 w-full max-w-[360px] flex-col items-center justify-center rounded-[8px] border border-white/[0.08] bg-[#111113] p-7 text-center shadow-xl shadow-black/20 transition-colors hover:border-[rgba(124,109,250,0.28)] hover:bg-[#151518]">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[8px] bg-[rgba(124,109,250,0.12)]">
            <svg className="h-5 w-5 text-[rgba(124,109,250,0.75)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M9 11l2 2 4-4M7 5h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-[#a1a1aa]">Total Tasks</p>
          <p className="mt-3 text-5xl font-semibold text-white" style={{ fontFamily: 'Geist, sans-serif' }}>
            {isLoading ? '-' : stats.totalTasks}
          </p>
        </Link>

        <a href="/projects" className="group flex h-56 w-full max-w-[360px] flex-col items-center justify-center rounded-[8px] border border-white/[0.08] bg-[#111113] p-7 text-center shadow-xl shadow-black/20 transition-colors hover:border-[rgba(124,109,250,0.32)] hover:bg-[#151518]">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[8px] bg-white/[0.04] transition-colors group-hover:bg-[rgba(124,109,250,0.14)]">
            <svg className="h-5 w-5 text-[#d4d4d8] transition-colors group-hover:text-[rgba(124,109,250,0.85)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 5v14m-7-7h14" />
            </svg>
          </div>
          <p className="text-base font-semibold text-white">Create New Project</p>
          <p className="mt-2 text-sm text-[#71717a]">Start something new</p>
        </a>

        <a href="/projects" className="group flex h-56 w-full max-w-[360px] flex-col items-center justify-center rounded-[8px] border border-white/[0.08] bg-[#111113] p-7 text-center shadow-xl shadow-black/20 transition-colors hover:border-[rgba(124,109,250,0.32)] hover:bg-[#151518]">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[8px] bg-white/[0.04] transition-colors group-hover:bg-[rgba(124,109,250,0.14)]">
            <svg className="h-5 w-5 text-[#d4d4d8] transition-colors group-hover:text-[rgba(124,109,250,0.85)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <p className="text-base font-semibold text-white">View All Projects</p>
          <p className="mt-2 text-sm text-[#71717a]">Browse your workspace</p>
        </a>
      </div>
      </section>
    </div>
  )
}
