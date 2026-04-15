/**
 * Dashboard Layout - Clean minimal style
 */

import React from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Header } from '@/components/layout/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-[#0a0a0b]">
        <div className="dashboard-navbar-shell">
          <Header />
        </div>
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}
