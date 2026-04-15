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
    <div className="flex flex-col items-center gap-8 py-2">
      <div className="space-y-3 text-center">
        <h2
          className="text-[34px] font-semibold leading-tight tracking-normal text-white"
          style={{ fontFamily: 'Geist, sans-serif' }}
        >
          Nexus
        </h2>
        <p className="text-sm font-medium leading-6 text-[#d4d4d8]">
          Project & Task Management
        </p>
      </div>

      <div className="w-full">
        <LoginForm onSubmit={handleLogin} />
      </div>

      <p className="text-center text-sm leading-6 text-[#a1a1aa]">
        New to Nexus?{' '}
        <Link
          href="/register"
          className="font-medium text-[rgba(124,109,250,0.9)] transition-colors hover:text-[rgba(124,109,250,1)]"
        >
          Create account
        </Link>
      </p>
    </div>
  )
}
