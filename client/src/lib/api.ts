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
    // First try direct projects endpoint
    const response = await fetch('/api/projects');
    if (response.ok) {
      return response.json();
    }
    
    // Then try the old handler endpoint
    console.log('Trying handler endpoint...');
    const handlerResponse = await fetch('/api/handler?action=projects');
    if (handlerResponse.ok) {
      const data = await handlerResponse.json();
      return data.projects || data;
    }
    
    // Finally try the new index endpoint
    console.log('Trying index endpoint...');
    const indexResponse = await fetch('/api/index?action=projects');
    if (!indexResponse.ok) {
      throw new Error('Failed to fetch projects');
    }
    return indexResponse.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    
    // Fallback to hardcoded data if all API calls fail
    return [
      {
        id: 1,
        title: "Portfolio Website",
        description: "Personal portfolio website built with React, Tailwind CSS, and Next.js",
        imageUrl: "/portfolio-preview.png",
        technologies: ["React", "Next.js", "Tailwind CSS", "SendGrid"],
        githubUrl: "https://github.com/yourusername/portfolio",
        liveUrl: ""
      },
      {
        id: 2,
        title: "CoupCoupon",
        description: "A coupon management system that helps users find and manage the best deals",
        imageUrl: "/Coupon.png",
        technologies: ["React", "Node.js", "MongoDB", "Express"],
        githubUrl: "https://github.com/yourusername/coupcoupon",
        liveUrl: ""
      },
      {
        id: 3,
        title: "Billiard Project",
        description: "Interactive billiards simulation developed with JavaScript and Canvas",
        imageUrl: "/billiardTable.png",
        technologies: ["JavaScript", "Canvas", "HTML5", "CSS3"],
        githubUrl: "https://github.com/yourusername/billiard-project",
        liveUrl: ""
      }
    ];
  }
}

export async function fetchSkills() {
  try {
    // First try direct skills endpoint
    const response = await fetch('/api/skills');
    if (response.ok) {
      return response.json();
    }
    
    // Then try the new index endpoint
    console.log('Trying index endpoint...');
    const indexResponse = await fetch('/api/index?action=skills');
    if (!indexResponse.ok) {
      throw new Error('Failed to fetch skills');
    }
    return indexResponse.json();
  } catch (error) {
    console.error('Error fetching skills:', error);
    
    // Fallback to hardcoded data if all API calls fail
    return [
      { id: 1, name: "React", category: "Frontend", level: 90 },
      { id: 2, name: "Next.js", category: "Frontend", level: 85 },
      { id: 3, name: "TypeScript", category: "Languages", level: 80 },
      { id: 4, name: "Node.js", category: "Backend", level: 85 },
      { id: 5, name: "Express", category: "Backend", level: 80 },
      { id: 6, name: "MongoDB", category: "Database", level: 75 },
      { id: 7, name: "PostgreSQL", category: "Database", level: 70 },
      { id: 8, name: "Tailwind CSS", category: "Frontend", level: 90 },
      { id: 9, name: "Docker", category: "DevOps", level: 65 },
      { id: 10, name: "AWS", category: "DevOps", level: 60 }
    ];
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
