'use client'

/**
 * Register Page
 * 
 * User registration page with registration form
 * Redirects to dashboard on successful registration
 */

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RegisterForm } from '@/components/auth/register-form'
import { useAuth } from '@/hooks/use-auth'
import type { RegisterFormData } from '@/lib/validators'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  
  const handleRegister = async (data: RegisterFormData) => {
    await register(data)
    router.push('/dashboard')
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-100 mb-2">Create an account</h2>
        <p className="text-gray-400">Get started with Nexus today</p>
      </div>
      
      <RegisterForm onSubmit={handleRegister} />
      
      <div className="text-center text-sm">
        <span className="text-gray-400">Already have an account? </span>
        <Link 
          href="/login" 
          className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}
