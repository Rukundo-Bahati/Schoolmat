"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: string
  isEmailVerified: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  verifyEmail: (otp: string) => Promise<void>
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>
  generateOtp: (email: string) => Promise<void>
  // Add these functions to the interface
  getReturnUrl: () => string
  setReturnUrl: (url: string) => void
  clearReturnUrl: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper functions for return URL management
const getReturnUrl = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('return_url') || '/'
  }
  return '/'
}

const setReturnUrl = (url: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('return_url', url)
  }
}

const clearReturnUrl = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('return_url')
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored token on mount and validate it
    const validateStoredToken = async () => {
      const storedToken = localStorage.getItem('access_token')
      if (storedToken) {
        try {
          // Validate token by making a request to a protected endpoint
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          })
          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
            setToken(storedToken)
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('access_token')
          }
        } catch (error) {
          console.error('Token validation failed:', error)
          localStorage.removeItem('access_token')
          // Only redirect if we're on a protected route
          if (window.location.pathname.includes('/dashboard') || window.location.pathname.includes('/cart')) {
            window.location.href = '/'
          }
        }
      } else {
        // Only redirect if we're on a protected route
        if (window.location.pathname.includes('/dashboard') || window.location.pathname.includes('/cart')) {
          window.location.href = '/'
        }
      }
      setIsLoading(false)
    }

    validateStoredToken()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        setToken(data.access_token)
        setUser(data.user)
        localStorage.setItem('access_token', data.access_token)
        clearReturnUrl()

        // Navigate to return URL or based on user role
        const returnUrl = getReturnUrl()
        if (data.user && data.user.isEmailVerified === false) {
          window.location.href = '/verify-email'
        } else if (data.user && data.user.role === 'school_manager') {
          window.location.href = '/school-manager'
        } else if (returnUrl && returnUrl !== '/' && returnUrl !== '/login' && returnUrl !== '/register') {
          // For all other users, return to the page they were on before login
          window.location.href = returnUrl
        } else {
          // Only use parent-dashboard as fallback for regular users
          window.location.href = '/parent-dashboard'
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Login failed. Please check your credentials and try again.')
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: any) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Validate response data structure
        if (!data || !data.access_token) {
          throw new Error('Invalid response from server - missing access token')
        }
        
        // Additional validation for user object
        if (!data.user) {
          console.warn('Registration response missing user object, setting to null')
        }
        
        setToken(data.access_token)
        setUser(data.user || null)
        localStorage.setItem('access_token', data.access_token)
        clearReturnUrl()

        // Navigate to return URL or based on user role with safe checks
        const returnUrl = getReturnUrl()
        if (data.user && data.user.role === 'school_manager') {
          window.location.href = '/school-manager'
        } else if (returnUrl && returnUrl !== '/' && returnUrl !== '/login' && returnUrl !== '/register') {
          // For all other users, return to the page they were on before login
          window.location.href = returnUrl
        } else {
          // Only use parent-dashboard as fallback for regular users
          window.location.href = '/parent-dashboard'
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.message || 
          'Registration failed. ' + 
          (response.status === 400 ? 'Please check your information and try again.' : 
           response.status === 409 ? 'An account with this email already exists.' :
           'Please try again later.')
        )
      }
    } catch (error: any) {
      // Enhanced error handling for network issues
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error - please check your connection and try again')
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const verifyEmail = async (otp: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
      })

      if (response.ok) {
        const data = await response.json()
        setToken(data.access_token)
        setUser(data.user)
        localStorage.setItem('access_token', data.access_token)
        clearReturnUrl()

        // Navigate to return URL or based on user role
        const returnUrl = getReturnUrl()
        if (data.user && data.user.role === 'school_manager') {
          window.location.href = '/school-manager'
        } else if (returnUrl && returnUrl !== '/' && returnUrl !== '/login' && returnUrl !== '/register') {
          // For all other users, return to the page they were on before login
          window.location.href = returnUrl
        } else {
          // Only use parent-dashboard as fallback for regular users
          window.location.href = '/parent-dashboard'
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.message || 
          (response.status === 400 ? 'Invalid or expired verification code. Please try again.' :
           'Email verification failed. Please try again.')
        )
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('fetch')) {
        throw new Error('Network error - please check your connection and try again')
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.message || 
          (response.status === 400 ? 'Invalid or expired verification code.' :
           response.status === 404 ? 'No account found with this email address.' :
           'Failed to reset password. Please try again.')
        )
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('fetch')) {
        throw new Error('Network error - please check your connection and try again')
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const generateOtp = async (email: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/generate-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.message || 
          (response.status === 404 ? 'No account found with this email address.' :
           'Failed to send verification code. Please try again.')
        )
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('fetch')) {
        throw new Error('Network error - please check your connection and try again')
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('access_token')
    clearReturnUrl()
    window.location.reload()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        verifyEmail,
        resetPassword,
        generateOtp,
        getReturnUrl,
        setReturnUrl,
        clearReturnUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
