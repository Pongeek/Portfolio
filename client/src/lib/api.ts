import { QueryClient } from "@tanstack/react-query";

const API_BASE = "/api";

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || response.statusText);
  }
  return response.json();
}

async function apiRequest(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
  });
  return handleResponse(response);
}

export async function fetchProjects() {
  return apiRequest('/projects');
}

export async function fetchSkills() {
  return apiRequest('/skills');
}

export async function fetchProfile() {
  return apiRequest('/profile');
}

export async function submitContact(data: {
  name: string;
  email: string;
  message: string;
}) {
  return apiRequest('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function login(username: string, password: string) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function logout() {
  return apiRequest('/auth/logout', {
    method: 'POST',
  });
}

// Initialize query client with better error handling
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
