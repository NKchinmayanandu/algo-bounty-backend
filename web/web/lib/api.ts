import { useAuthStore } from './auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = useAuthStore.getState().token;
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  headers.set('Content-Type', 'application/json');

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
};
