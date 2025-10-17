/**
 * Utility functions for handling errors gracefully in development and production
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  isBusinessLogicError?: boolean;
}

/**
 * Handles API responses and prevents Next.js error overlay for expected business logic errors
 */
export function handleApiError(error: any, context: string): ApiResponse {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Check if it's a business logic error (expected behavior)
  const isBusinessLogicError = 
    errorMessage.includes('has been ordered') ||
    errorMessage.includes('foreign key constraint') ||
    errorMessage.includes('Cannot delete') ||
    errorMessage.includes('already exists') ||
    errorMessage.includes('not found');

  // Only log unexpected system errors in development
  if (!isBusinessLogicError && process.env.NODE_ENV === 'development') {
    console.error(`Unexpected error in ${context}:`, error);
  }

  return {
    success: false,
    error: errorMessage,
    isBusinessLogicError
  };
}

/**
 * Safely executes an async operation and returns a standardized response
 */
export async function safeApiCall<T>(
  operation: () => Promise<T>,
  context: string
): Promise<ApiResponse<T>> {
  try {
    const data = await operation();
    return {
      success: true,
      data
    };
  } catch (error) {
    return handleApiError(error, context);
  }
}

/**
 * Shows user-friendly error messages based on error type
 */
export function showErrorMessage(response: ApiResponse, defaultMessage: string = "An error occurred") {
  if (!response.error) return;

  if (response.isBusinessLogicError) {
    // Business logic errors are expected and should be shown to user
    if (response.error.includes('has been ordered')) {
      alert("⚠️ Cannot Delete Product\n\nThis product cannot be deleted because it has been ordered by customers. This preserves order history and maintains data integrity.\n\n💡 Alternative: You can disable the product instead to hide it from customers while keeping order records intact.");
    } else {
      alert(`⚠️ ${response.error}`);
    }
  } else {
    // System errors should be reported differently
    alert(`❌ ${defaultMessage}: ${response.error}`);
  }
}