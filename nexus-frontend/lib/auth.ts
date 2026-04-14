/**
 * Authentication Utilities and Token Storage
 * 
 * This module provides token management functions for JWT authentication:
 * - In-memory token storage (secure, prevents XSS attacks)
 * - Token expiry detection using jwt-decode
 * - Token lifecycle management (get, set, clear)
 */

import { jwtDecode } from 'jwt-decode'

// In-memory token storage (more secure than localStorage)
let accessToken: string | null = null

/**
 * JWT payload interface
 */
interface JWTPayload {
  sub: string // User ID
  email: string
  role: string
  iat: number // Issued at
  exp: number // Expiry timestamp
}

/**
 * Get the current access token from memory
 * @returns The access token or null if not set
 */
export function getAccessToken(): string | null {
  return accessToken
}

/**
 * Set the access token in memory
 * @param token - The JWT access token to store
 */
export function setAccessToken(token: string | null): void {
  accessToken = token
}

/**
 * Clear the access token from memory
 */
export function clearAccessToken(): void {
  accessToken = null
}

/**
 * Check if a JWT token is expired
 * @param token - The JWT token to check
 * @returns true if the token is expired, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JWTPayload>(token)
    const currentTime = Date.now() / 1000 // Convert to seconds
    
    // Token is expired if current time is greater than expiry time
    return currentTime >= decoded.exp
  } catch (error) {
    // If token cannot be decoded, consider it expired
    console.error('Failed to decode token:', error)
    return true
  }
}

/**
 * Get the expiry time of a JWT token
 * @param token - The JWT token
 * @returns The expiry timestamp in milliseconds, or null if invalid
 */
export function getTokenExpiry(token: string): number | null {
  try {
    const decoded = jwtDecode<JWTPayload>(token)
    return decoded.exp * 1000 // Convert to milliseconds
  } catch (error) {
    console.error('Failed to decode token:', error)
    return null
  }
}

/**
 * Get the time remaining until token expiry
 * @param token - The JWT token
 * @returns Time remaining in milliseconds, or 0 if expired/invalid
 */
export function getTimeUntilExpiry(token: string): number {
  const expiryTime = getTokenExpiry(token)
  if (!expiryTime) return 0
  
  const timeRemaining = expiryTime - Date.now()
  return Math.max(0, timeRemaining)
}
