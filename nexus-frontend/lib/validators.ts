/**
 * Zod Validation Schemas
 * 
 * This module defines validation schemas for all forms in the application.
 * Schemas enforce data integrity and provide user-friendly error messages.
 */

import { z } from 'zod'

/**
 * Login Form Schema
 * Validates email and password for user authentication
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required')
})

/**
 * Register Form Schema
 * Validates email, name, and password for user registration
 * Password must meet complexity requirements
 */
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
})

/**
 * Project Form Schema
 * Validates project name, description, and status
 */
export const projectSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must not exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
  status: z
    .enum(['ACTIVE', 'ARCHIVED'], {
      message: 'Status must be either ACTIVE or ARCHIVED'
    })
    .optional()
    .default('ACTIVE')
})

/**
 * Task Form Schema
 * Validates task title, description, status, priority, and due date
 */
export const taskSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),
  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .optional()
    .or(z.literal('')),
  status: z
    .enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'], {
      message: 'Invalid status'
    })
    .optional()
    .default('TODO'),
  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
      message: 'Invalid priority'
    })
    .optional()
    .default('MEDIUM'),
  dueDate: z
    .string()
    .datetime({ message: 'Invalid date format' })
    .optional()
    .or(z.literal('')),
  assigneeId: z
    .string()
    .uuid('Invalid assignee ID')
    .optional()
    .or(z.literal(''))
})

/**
 * Type inference from schemas
 */
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ProjectFormData = z.infer<typeof projectSchema>
export type TaskFormData = z.infer<typeof taskSchema>
