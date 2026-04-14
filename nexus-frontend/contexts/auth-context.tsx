'use client'

/**
 * Authentication Context and Provider
 * 
 * Manages global authentication state including:
 * - User authentication status
 * - Login, register, and logout operations
 * - Automatic token refresh scheduling
 * - User profile data
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { apiClient } from '@/lib/api-client'
import { 
  getAccessToken, 
  setAccessToken, 
  clearAccessToken,
  getTimeUntilExpiry,
  isTokenExpired
} from '@/lib/auth'
import type { User } from '@/types'

/**
 * Authentication context value interface
 */
interface AuthContextValue {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterInput) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
}

/**
 * Register input interface
 */
interface RegisterInput {
  email: string
  name: string
  password: string
}

/**
 * Create authentication context
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined)

/**
 * Authentication Provider Props
 */
interface AuthProviderProps {
  children: React.ReactNode
}

/**
 * Authentication Provider Component
 * Wraps the application and provides authentication state to all children
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * Internal logout handler
   */
  const handleLogout = useCallback(() => {
    // Clear refresh timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
      refreshTimeoutRef.current = null
    }
    
    // Clear authentication state
    clearAccessToken()
    setUser(null)
    
    // Redirect to login if in browser
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }, [])

  /**
   * Refresh the access token
   */
  const refreshToken = useCallback(async () => {
    try {
      const response = await apiClient.post('/auth/refresh')
      const { accessToken: newToken, user: userData } = response.data.data
      
      setAccessToken(newToken)
      setUser(userData)
      
      // Return the new token so setupTokenRefresh can use it
      return newToken
    } catch (error) {
      console.error('Token refresh failed:', error)
      throw error
    }
  }, [])

  /**
   * Setup automatic token refresh
   * Schedules refresh 1 minute before token expiry
   */
  const setupTokenRefresh = useCallback(() => {
    // Clear any existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
    }

    const token = getAccessToken()
    if (!token) return

    // Check if token is already expired
    if (isTokenExpired(token)) {
      handleLogout()
      return
    }

    const timeUntilExpiry = getTimeUntilExpiry(token)
    // Refresh 1 minute (60000ms) before expiry
    const refreshTime = timeUntilExpiry - 60000

    if (refreshTime > 0) {
      const timeoutId = setTimeout(async () => {
        try {
          const newToken = await refreshToken()
          // After refresh, schedule the next refresh with the new token
          if (newToken) {
            const newTimeUntilExpiry = getTimeUntilExpiry(newToken)
            const newRefreshTime = newTimeUntilExpiry - 60000
            if (newRefreshTime > 0) {
              const newTimeoutId = setTimeout(async () => {
                try {
                  await refreshToken()
                } catch (error) {
                  console.error('Token refresh failed:', error)
                  handleLogout()
                }
              }, newRefreshTime)
              refreshTimeoutRef.current = newTimeoutId
            }
          }
        } catch (error) {
          console.error('Token refresh failed:', error)
          handleLogout()
        }
      }, refreshTime)
      
      refreshTimeoutRef.current = timeoutId
    } else {
      // Token expires in less than 1 minute, refresh immediately
      refreshToken().catch(() => handleLogout())
    }
  }, [handleLogout, refreshToken])

  /**
   * Login with email and password
   */
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await apiClient.post('/auth/login', { email, password })
      const { accessToken, user: userData } = response.data.data
      
      setAccessToken(accessToken)
      setUser(userData)
      
      // Setup automatic token refresh
      setupTokenRefresh()
    } catch (error: any) {
      console.error('Login failed:', error)
      throw new Error(error.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }, [setupTokenRefresh])

  /**
   * Register a new user account
   */
  const register = useCallback(async (data: RegisterInput) => {
    try {
      setIsLoading(true)
      const response = await apiClient.post('/auth/register', data)
      const { accessToken, user: userData } = response.data.data
      
      setAccessToken(accessToken)
      setUser(userData)
      
      // Setup automatic token refresh
      setupTokenRefresh()
    } catch (error: any) {
      console.error('Registration failed:', error)
      throw new Error(error.response?.data?.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }, [setupTokenRefresh])

  /**
   * Logout the current user
   */
  const logout = useCallback(async () => {
    try {
      // Attempt to logout on server (clear refresh token cookie)
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Logout request failed:', error)
      // Continue with local logout even if server request fails
    } finally {
      handleLogout()
    }
  }, [handleLogout])

  /**
   * Check authentication status on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken()
      
      if (token && !isTokenExpired(token)) {
        try {
          // Token exists and is valid, fetch user profile
          const response = await apiClient.get('/auth/me')
          setUser(response.data.data)
          
          // Setup token refresh
          setupTokenRefresh()
        } catch (error) {
          console.error('Failed to fetch user profile:', error)
          clearAccessToken()
        }
      }
      
      setIsLoading(false)
    }

    initAuth()

    // Cleanup on unmount
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
    }
  }, [setupTokenRefresh])

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user && !!getAccessToken(),
    login,
    register,
    logout,
    refreshToken
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to access authentication context
 * Must be used within AuthProvider
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}
