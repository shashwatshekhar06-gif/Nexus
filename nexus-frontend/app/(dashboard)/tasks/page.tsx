'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'
import type { Task, TaskPriority, TaskStatus } from '@/types'

const statusStyles: Record<TaskStatus, string> = {
  TODO: 'border-[#71717a]/30 bg-[#71717a]/10 text-[#d4d4d8]',
  IN_PROGRESS: 'border-[#38bdf8]/30 bg-[#38bdf8]/10 text-[#7dd3fc]',
  IN_REVIEW: 'border-[#f59e0b]/30 bg-[#f59e0b]/10 text-[#fbbf24]',
  DONE: 'border-[#22c55e]/30 bg-[#22c55e]/10 text-[#86efac]',
}

const priorityStyles: Record<TaskPriority, string> = {
  LOW: 'border-[#a1a1aa]/25 bg-[#a1a1aa]/10 text-[#d4d4d8]',
  MEDIUM: 'border-[#38bdf8]/30 bg-[#38bdf8]/10 text-[#7dd3fc]',
  HIGH: 'border-[#f59e0b]/30 bg-[#f59e0b]/10 text-[#fbbf24]',
  URGENT: 'border-[#ef4444]/30 bg-[#ef4444]/10 text-[#fca5a5]',
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default function TasksOverviewPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setError(null)
        const response = await apiClient.get('/tasks?limit=100')
        setTasks(response.data.data || [])
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load tasks')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  return (
    <div className="flex w-full justify-center">
      <section className="flex w-full max-w-[1040px] flex-col items-start gap-7">
        <div className="flex w-full flex-col gap-3 text-left">
          <div className="flex justify-start">
            <Link
              href="/dashboard"
              className="inline-flex max-w-fit rounded-lg bg-blue-500 px-6 py-3 mt-6 text-sm font-semibold text-white shadow-xl shadow-blue-500/20 transition hover:bg-blue-400 active:scale-[0.98]"
            >
              Back to Dashboard
            </Link>
          </div>
          <p className="text-sm text-[#888]">
            {isLoading ? 'Loading your tasks...' : `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'} in your workspace`}
          </p>
        </div>

        {error && (
          <div className="w-full max-w-xl rounded-[8px] border border-[#ef4444]/30 bg-[#ef4444]/10 p-4 text-center text-sm text-[#fca5a5]">
            {error}
          </div>
        )}

        {!error && isLoading && (
          <div className="grid w-full grid-cols-1 justify-items-center gap-3 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-52 w-full max-w-[310px] animate-pulse rounded-[8px] border border-white/[0.06] bg-[#111113]"
              />
            ))}
          </div>
        )}

        {!error && !isLoading && tasks.length === 0 && (
          <div className="w-full max-w-xl rounded-[8px] border border-white/[0.08] bg-[#111113] p-10 text-center">
            <h2 className="text-lg font-semibold text-white">No tasks yet</h2>
            <p className="mt-2 text-sm text-[#888]">Tasks you create or own will show up here.</p>
          </div>
        )}

        {!error && !isLoading && tasks.length > 0 && (
          <div className="grid w-full grid-cols-1 justify-items-center gap-3 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <article
                key={task.id}
                className="flex h-52 w-full max-w-[310px] flex-col rounded-[8px] border border-white/[0.08] bg-[#111113] p-6 shadow-xl shadow-black/20 transition-colors hover:border-[rgba(124,109,250,0.3)] hover:bg-[#151518]"
              >
                <div className="flex flex-1 items-start gap-5">
                  <div className="min-w-0 flex-1 pr-4 text-left">
                    <h2 className="line-clamp-2 text-[15px] font-semibold leading-6 text-white">
                      {task.title}
                    </h2>
                    <p className="mt-2.5 line-clamp-3 text-[13px] leading-5 text-[#a1a1aa]">
                      {task.description || 'No description provided.'}
                    </p>
                  </div>

                  <span className={`mt-1 inline-flex h-7 w-20 shrink-0 items-center justify-center rounded-full border text-[9px] font-semibold leading-none ${priorityStyles[task.priority]}`}>
                      {formatLabel(task.priority)}
                  </span>
                </div>

                <div className="mt-4 flex justify-center pb-1">
                  <span className={`inline-flex h-8 w-32 items-center justify-center rounded-full border text-[10px] font-semibold leading-none ${statusStyles[task.status]}`}>
                    {formatLabel(task.status)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
