'use client'

/**
 * Dashboard Home Page - Clean Notion/Vercel Style
 */

import React, { useEffect, useState } from 'react'
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
        } catch (taskError) {
          // Tasks endpoint not implemented yet, keep as 0
          console.log('Tasks endpoint not available yet')
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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-[22px] font-semibold text-white mb-1" style={{ fontFamily: 'Geist, sans-serif', fontWeight: 600 }}>
          {getGreeting()}, {user?.name}
        </h1>
        <p className="text-[13px] text-[#555]">
          Here is your workspace overview
        </p>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#111113] border border-[rgba(255,255,255,0.08)] rounded-[10px] p-6">
          <div className="text-[32px] font-bold text-white mb-1" style={{ fontFamily: 'Geist, sans-serif', fontWeight: 700 }}>
            {isLoading ? '...' : stats.totalProjects}
          </div>
          <div className="text-[12px] text-[#666]">
            Total Projects
          </div>
        </div>
        
        <div className="bg-[#111113] border border-[rgba(255,255,255,0.08)] rounded-[10px] p-6">
          <div className="text-[32px] font-bold text-white mb-1" style={{ fontFamily: 'Geist, sans-serif', fontWeight: 700 }}>
            {isLoading ? '...' : stats.totalTasks}
          </div>
          <div className="text-[12px] text-[#666]">
            Total Tasks
          </div>
        </div>
      </div>
    </div>
  )
}
