/**
 * Button Component - Clean Notion/Vercel Style
 */

import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0b] disabled:opacity-50 disabled:cursor-not-allowed'
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-[#6c5ce7] text-white hover:bg-[#7c6dfa] focus:ring-[rgba(124,109,250,0.3)] text-[13px] h-9 rounded-[6px]',
    secondary: 'bg-[#111113] text-white hover:bg-[#1a1a1f] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.14)] focus:ring-[rgba(124,109,250,0.3)] text-[13px] h-9 rounded-[6px]',
    danger: 'bg-[#ef4444] text-white hover:bg-[#dc2626] focus:ring-[rgba(239,68,68,0.3)] text-[13px] h-9 rounded-[6px]',
    ghost: 'bg-transparent text-[#888] hover:text-white hover:bg-[#111113] focus:ring-[rgba(124,109,250,0.3)] text-[13px] h-9 rounded-[6px]'
  }
  
  // Size styles
  const sizeStyles = {
    sm: 'px-3 text-[12px] h-8',
    md: 'px-4 text-[13px] h-9',
    lg: 'px-6 text-[13px] h-10'
  }
  
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`
  
  return (
    <button
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  )
}
