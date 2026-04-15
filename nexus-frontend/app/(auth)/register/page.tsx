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
    <div style={{ fontFamily: "Geist, sans-serif" }} className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-md rounded-lg border border-gray-700/50 p-8 shadow-xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400 text-sm">Join Nexus and start managing your projects</p>
          </div>

          {/* Registration Form */}
          <RegisterForm onSubmit={handleRegister} />

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-3 text-gray-400 text-sm">Already a member?</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-gray-400 text-sm">
            Have an account?{' '}
            <Link 
              href="/login" 
              style={{ color: "rgba(124,109,250,1)" }}
              className="font-medium hover:opacity-80 transition-opacity"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 text-xs mt-4">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
