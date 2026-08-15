const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface FetchOptions extends RequestInit {
  token?: string;
}

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  // Attempt to load token from localStorage if running in client context
  let token = options.token;
  if (!token && typeof window !== 'undefined') {
    token = localStorage.getItem('token') || undefined;
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return {} as T;
  }

  const contentType = response.headers.get('Content-Type');
  let data: any;
  
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    // If it's a string message, throw it, else if it has an error payload
    const errorMsg = typeof data === 'string' ? data : (data?.message || response.statusText || 'API Request failed');
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) => 
    request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body: any, options?: FetchOptions) => 
    request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: any, options?: FetchOptions) => 
    request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: FetchOptions) => 
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
