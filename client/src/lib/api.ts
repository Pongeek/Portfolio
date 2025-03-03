import { QueryClient } from "@tanstack/react-query";
import { type Message } from "@db/schema";

const API_BASE = "/api";

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "An error occurred while fetching data");
  }
  return response.json();
}

async function apiRequest(endpoint: string, options?: RequestInit) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  return handleResponse(response);
}

export async function fetchProjects() {
  try {
    const response = await fetch('/api/projects');
    if (!response.ok) {
      console.error("Fallback to handler endpoint");
      const handlerResponse = await fetch('/api/handler?action=projects');
      if (!handlerResponse.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await handlerResponse.json();
      return data.projects;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
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
  try {
    const response = await fetch('/api/handler?action=contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      // Try fallback to original endpoint
      console.log("Trying fallback to original contact endpoint");
      return apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
    
    return response.json();
  } catch (error) {
    console.error("Error submitting contact:", error);
    throw new Error("Failed to send message. Please try again.");
  }
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
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});
