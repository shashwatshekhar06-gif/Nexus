'use client'

/**
 * Header Component - Clean Notion/Vercel Style
 */

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

export function Header() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const isAdmin = user?.role === 'ADMIN'
  
  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/projects', label: 'Projects' },
    ...(isAdmin ? [{ href: '/admin', label: 'Admin' }] : [])
  ]
  
  const isActiveLink = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/')
  }
  
  const handleLogout = async () => {
    await logout()
  }
  
  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(255,255,255,0.05)] bg-[#0a0a0b] bg-opacity-80 backdrop-blur-md" style={{ height: '56px' }}>
      <div
        className="h-full w-full"
        style={{
          paddingLeft: '48px',
          paddingRight: '48px',
        }}
      >
        <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center">
          {/* Logo */}
          <Link href="/dashboard" className="ml-2 flex flex-shrink-0 items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-base font-semibold text-white" style={{ fontFamily: 'Geist, sans-serif' }}>Nexus</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden items-center justify-center gap-2 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-[6px] px-3 py-2 text-sm transition-colors duration-150 font-medium ${
                  isActiveLink(link.href)
                    ? 'bg-white/[0.06] text-white'
                    : 'text-[#999] hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          {/* User Menu */}
          <div className="mr-2 hidden items-center justify-end gap-4 md:flex">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-[#666]">{user?.email}</p>
              </div>
              <div className="w-px h-6 bg-[rgba(255,255,255,0.1)]"></div>
              <button
                onClick={handleLogout}
                className="rounded-[6px] border border-white/[0.08] px-3 py-1.5 text-sm font-medium text-[#d4d4d8] transition-colors duration-150 hover:border-white/[0.16] hover:bg-white/[0.04] hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="justify-self-end p-2 text-[#888] transition-colors hover:text-white md:hidden"
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[rgba(255,255,255,0.06)]">
            <nav className="flex flex-col gap-2 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 text-[13px] transition-colors duration-150 ${
                    isActiveLink(link.href)
                      ? 'text-white'
                      : 'text-[#888] hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            
            <div className="px-3 py-3 bg-[#111113] rounded-md border border-[rgba(255,255,255,0.08)] mb-2">
              <p className="text-[13px] text-white">{user?.name}</p>
              <p className="text-[11px] text-[#555]">{user?.email}</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 text-[13px] text-[#555] hover:text-white transition-colors text-left"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
