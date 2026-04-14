'use client'

/**
 * Login Page
 * 
 * User authentication page with login form
 * Redirects to dashboard on successful login
 */

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'
import { useAuth } from '@/hooks/use-auth'
import type { LoginFormData } from '@/lib/validators'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  
  const handleLogin = async (data: LoginFormData) => {
    await login(data.email, data.password)
    router.push('/dashboard')
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-100 mb-2">Welcome back</h2>
        <p className="text-gray-400">Sign in to your account to continue</p>
      </div>
      
      <LoginForm onSubmit={handleLogin} />
      
      <div className="text-center text-sm">
        <span className="text-gray-400">Don't have an account? </span>
        <Link 
          href="/register" 
          className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          Sign up
        </Link>
      </div>
    </div>
  )
}
