/**
 * API Client with Axios Interceptors
 * 
 * This module provides a configured axios instance with:
 * - Automatic authentication token injection
 * - Automatic token refresh on 401 errors
 * - Request/response interceptors for error handling
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { getAccessToken, setAccessToken, clearAccessToken } from './auth'

// Extend AxiosRequestConfig to include _retry flag
interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  timeout: 30000,
  withCredentials: true, // Include cookies for refresh token
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request Interceptor
 * Adds Authorization header with Bearer token to all requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * Handles 401 errors by attempting token refresh and retrying the original request
 */
apiClient.interceptors.response.use(
  (response) => {
    // Pass through successful responses
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableAxiosRequestConfig

    // Check if error is 401 and we haven't already retried
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Mark request as retried to prevent infinite loops
      originalRequest._retry = true

      try {
        // Attempt to refresh the token
        const response = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          {},
          { 
            withCredentials: true, // Include refresh token cookie
          }
        )

        // Extract new access token from response
        const newAccessToken = response.data.data.accessToken
        
        // Store the new token
        setAccessToken(newAccessToken)

        // Update the Authorization header for the original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }

        // Retry the original request with the new token
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Token refresh failed, clear auth state and redirect to login
        clearAccessToken()
        
        // Only redirect if we're in a browser environment
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        
        return Promise.reject(refreshError)
      }
    }

    // For all other errors, reject the promise
    return Promise.reject(error)
  }
)

export { apiClient, getAccessToken, setAccessToken, clearAccessToken }
