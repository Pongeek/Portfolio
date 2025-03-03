import { QueryClient } from "@tanstack/react-query";

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
  console.log(`API Request: ${url}`, options);
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
    return await apiRequest('/projects');
  } catch (error) {
    console.error('Error fetching projects:', error);
    console.log('Trying index endpoint with projects action...');
    const response = await fetch('/api/index?action=projects');
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return response.json();
  }
}

export async function fetchSkills() {
  try {
    return await apiRequest('/skills');
  } catch (error) {
    console.log('Trying index endpoint with skills action...');
    const response = await fetch('/api/index?action=skills');
    if (!response.ok) {
      throw new Error('Failed to fetch skills');
    }
    return response.json();
  }
}

export async function fetchProfile() {
  try {
    return await apiRequest('/profile');
  } catch (error) {
    console.log('Trying index endpoint with profile action...');
    const response = await fetch('/api/index?action=profile');
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    return response.json();
  }
}

export async function submitContact(data: {
  name: string;
  email: string;
  message: string;
}) {
  try {
    return await apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.log('Trying index endpoint with contact action...');
    const response = await fetch('/api/index?action=contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to send message');
    }
    
    return response.json();
  }
}

export async function login(username: string, password: string) {
  try {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  } catch (error) {
    console.log('Trying index endpoint with auth action...');
    const response = await fetch('/api/index', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      throw new Error('Invalid credentials');
    }
    
    return response.json();
  }
}

export async function logout() {
  try {
    return await apiRequest('/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    console.log('Trying index endpoint with auth action...');
    const response = await fetch('/api/index?action=auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to logout');
    }
    
    return response.json();
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});
