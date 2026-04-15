'use client'

/**
 * Login Form Component
 * 
 * Form for user authentication with validation and error handling
 * Uses react-hook-form with Zod validation
 */

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/lib/validators'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ErrorMessage } from '@/components/ui/error-message'
import type { LoginFormData } from '@/lib/validators'

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>
  isLoading?: boolean
}

export function LoginForm({ onSubmit, isLoading: externalLoading }: LoginFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })
  
  const isLoading = isSubmitting || externalLoading
  
  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      setApiError(null)
      await onSubmit(data)
    } catch (error: unknown) {
      setApiError(error instanceof Error ? error.message : 'Login failed. Please try again.')
    }
  }
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex w-full flex-col items-center space-y-5">
      {apiError && (
        <ErrorMessage error={apiError} />
      )}
      
      <div className="w-72 max-w-full">
        <Input
          label="Email"
          variant="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          disabled={isLoading}
          maxWidth="w-full"
          {...register('email')}
        />
        {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
      </div>
      
      <div className="w-72 max-w-full">
        <Input
          label="Password"
          variant="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          disabled={isLoading}
          maxWidth="w-full"
          {...register('password')}
        />
        {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
      </div>
      
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        disabled={isLoading}
        className="mt-2 w-72 max-w-full"
      >
        {isLoading ? 'Logging in...' : 'Log In'}
      </Button>
    </form>
  )
}
