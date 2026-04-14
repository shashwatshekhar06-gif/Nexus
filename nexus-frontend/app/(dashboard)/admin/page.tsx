'use client'

/**
 * Admin Page
 * 
 * Admin panel for user management
 * (To be fully implemented in later tasks)
 */

import React from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'

function AdminPageContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Admin Panel</h1>
        <p className="text-gray-400">Manage users and system settings</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl font-bold text-blue-400 mb-2">0</div>
          <div className="text-sm text-gray-400">Total Users</div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl font-bold text-green-400 mb-2">0</div>
          <div className="text-sm text-gray-400">Total Projects</div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl font-bold text-purple-400 mb-2">0</div>
          <div className="text-sm text-gray-400">Total Tasks</div>
        </div>
      </div>
      
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">User Management</h2>
        <p className="text-gray-400">User management features will be implemented here.</p>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminPageContent />
    </ProtectedRoute>
  )
}
