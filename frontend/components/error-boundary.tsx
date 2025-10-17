'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Check if it's a business logic error that should be handled gracefully
    const isBusinessLogicError = 
      error.message.includes('has been ordered') ||
      error.message.includes('foreign key constraint') ||
      error.message.includes('Cannot delete') ||
      error.message.includes('already exists')

    // Don't show error boundary for business logic errors
    if (isBusinessLogicError) {
      return { hasError: false }
    }

    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Only log unexpected errors
    const isBusinessLogicError = 
      error.message.includes('has been ordered') ||
      error.message.includes('foreign key constraint') ||
      error.message.includes('Cannot delete') ||
      error.message.includes('already exists')

    if (!isBusinessLogicError) {
      console.error('Unexpected error caught by boundary:', error, errorInfo)
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback

      if (FallbackComponent) {
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-sm font-bold">!</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Something went wrong</h3>
                <p className="text-sm text-gray-600">An unexpected error occurred</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700 font-mono">{this.state.error.message}</p>
            </div>

            <button
              onClick={this.resetError}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}