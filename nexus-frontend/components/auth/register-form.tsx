'use client'

/**
 * Register Form Component
 * 
 * Form for user registration with validation and error handling
 * Uses react-hook-form with Zod validation
 */

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '@/lib/validators'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ErrorMessage } from '@/components/ui/error-message'
import type { RegisterFormData } from '@/lib/validators'

export interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>
  isLoading?: boolean
}

export function RegisterForm({ onSubmit, isLoading: externalLoading }: RegisterFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })
  
  const isLoading = isSubmitting || externalLoading
  
  const handleFormSubmit = async (data: RegisterFormData) => {
    try {
      setApiError(null)
      await onSubmit(data)
    } catch (error: any) {
      setApiError(error.message || 'Registration failed. Please try again.')
    }
  }
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 w-full">
      {apiError && (
        <ErrorMessage error={apiError} />
      )}
      
      <div>
        <Input
          label="Email"
          variant="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          disabled={isLoading}
          maxWidth="w-full"
          {...register('email')}
        />
      </div>
      
      <div>
        <Input
          label="Full Name"
          variant="text"
          placeholder="Your full name"
          error={errors.name?.message}
          disabled={isLoading}
          maxWidth="w-full"
          {...register('name')}
        />
      </div>
      
      <div>
        <Input
          label="Password"
          variant="password"
          placeholder="Create a strong password"
          error={errors.password?.message}
          disabled={isLoading}
          maxWidth="w-full"
          {...register('password')}
        />
      </div>
      
      <div className="text-xs text-gray-400 space-y-1">
        <p className="font-medium">Password requirements:</p>
        <ul className="list-disc list-inside space-y-0.5 ml-1">
          <li>At least 8 characters</li>
          <li>One uppercase letter</li>
          <li>One lowercase letter</li>
          <li>One number</li>
          <li>One special character</li>
        </ul>
      </div>
      
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        disabled={isLoading}
        className="w-full mt-6"
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  )
}
