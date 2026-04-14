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
    <header className="bg-[#0f0f10] border-b border-[rgba(255,255,255,0.06)] sticky top-0 z-40" style={{ height: '52px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
              <span className="text-black font-bold text-sm">N</span>
            </div>
            <span className="text-sm font-semibold text-white" style={{ fontFamily: 'Geist, sans-serif' }}>Nexus</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] transition-colors duration-150 ${
                  isActiveLink(link.href)
                    ? 'text-white'
                    : 'text-[#888] hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[13px] text-white">{user?.name}</p>
                <p className="text-[11px] text-[#555]">{user?.email}</p>
              </div>
              <div className="w-px h-8 bg-[rgba(255,255,255,0.06)]"></div>
              <button
                onClick={handleLogout}
                className="text-[13px] text-[#555] hover:text-white transition-colors duration-150"
              >
                Logout
              </button>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#888] hover:text-white transition-colors"
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
