/**
 * Input Component - Clean Notion/Vercel Style
 */

'use client'

import React, { useId } from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string
  error?: string
  variant?: 'text' | 'email' | 'password' | 'textarea'
  rows?: number
  maxWidth?: string
}

export const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ label, error, variant = 'text', className = '', rows = 4, maxWidth = 'w-full', id, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id || generatedId
    
    // Base styles
    const baseStyles = `${maxWidth} px-4 py-2.5 bg-[#111113] border rounded-lg text-white placeholder-[#555] text-sm transition-all duration-150 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed`
    
    // Error styles
    const errorStyles = error 
      ? 'border-[#ef4444] focus:ring-[rgba(239,68,68,0.3)] focus:border-[#ef4444]' 
      : 'border-[rgba(255,255,255,0.1)] focus:ring-[rgba(124,109,250,0.3)] focus:border-[rgba(124,109,250,0.3)]'
    
    const combinedClassName = `${baseStyles} ${errorStyles} ${className}`
    
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-[12px] font-medium text-white"
          >
            {label}
          </label>
        )}
        
        {variant === 'textarea' ? (
          <textarea
            id={inputId}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={combinedClassName}
            rows={rows}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={inputId}
            ref={ref as React.Ref<HTMLInputElement>}
            type={variant}
            className={combinedClassName}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        
        {error && (
          <p className="text-[11px] text-[#ef4444] flex items-center gap-1">
            <svg 
              className="w-3 h-3 flex-shrink-0" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
