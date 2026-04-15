/**
 * Auth Layout
 * 
 * Minimal layout for authentication pages (login, register)
 * Centers content vertically and horizontally
 */

import React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-[380px]">
          <div className="rounded-[8px] border border-white/[0.08] bg-[#111113] px-8 py-10 shadow-2xl shadow-black/30">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
