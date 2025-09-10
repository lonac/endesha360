import { useCallback } from 'react';

/**
 * useAuthenticatedFetch - React hook for making authenticated API requests with JWT token from localStorage.
 * Usage:
 *   const fetchWithAuth = useAuthenticatedFetch();
 *   fetchWithAuth(url, options)
 */
export function useAuthenticatedFetch() {
  return useCallback((url, options = {}) => {
    const token = localStorage.getItem('adminToken');
    const headers = {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    return fetch(url, { ...options, headers });
  }, []);
}
