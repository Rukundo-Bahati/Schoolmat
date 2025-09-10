// Helper function to get authentication token
export function getAuthToken(): string | null {
  return localStorage.getItem('access_token') || localStorage.getItem('token');
}

// Helper function to make authenticated API calls
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token provided');
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
