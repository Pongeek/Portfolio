// ─── Fallback data (used when the API is unreachable) ─────────────────────────

const FALLBACK_PROJECTS = [
  {
    id: 1,
    title: "Portfolio Website",
    description:
      "Full-stack portfolio built with React 18, TypeScript, and Express. Features a PostgreSQL backend with Drizzle ORM, serverless deployment to Vercel, dark/light theming with zero flash, and a rate-limited contact form with server-side validation.",
    imageUrl: "/max-profile.png",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Express", "PostgreSQL"],
    githubUrl: "https://github.com/Pongeek/Portfolio",
    liveUrl: "",
  },
  {
    id: 2,
    title: "CoupCoupon",
    description:
      "Role-based coupon management system with three distinct user tiers: Admin, Company, and Customer. Java Spring Boot backend exposes a RESTful API secured with JWT. React/TypeScript frontend consumes the API with dynamic dashboards per role, backed by a MySQL database.",
    imageUrl: "/Coupon.png",
    technologies: ["Java Spring", "React", "TypeScript", "MySQL", "JWT", "RESTful API"],
    githubUrl: "https://github.com/Pongeek/CoupCoupon-client",
    liveUrl: "",
  },
  {
    id: 3,
    title: "Billiard Game — Squeak Smalltalk",
    description:
      "Object-oriented billiard game built from scratch in Squeak Smalltalk. Implements real-time elastic collision physics, mouse-driven trajectory aiming, game-state management, and a clean separation between the physics engine and UI rendering layers.",
    imageUrl: "/billiardTable.png",
    technologies: ["Squeak Smalltalk", "OOP", "Physics Simulation", "Game Development"],
    githubUrl:
      "https://github.com/Pongeek/object-oriented-programming-Squeak-Smalltalk/tree/main",
    liveUrl: "",
  },
  {
    id: 4,
    title: "TileTech",
    description:
      "Professional business website for a tiling and renovation company serving central Israel. Built with Next.js 14 App Router and TypeScript — features bilingual RTL/LTR support for Hebrew and English, SEO optimization with JSON-LD structured data and automatic sitemap generation, image optimization with WebP/AVIF conversion, and a validated contact form. Deployed to Vercel.",
    imageUrl: "/tiletech-preview.png",
    technologies: ["Next.js 14", "TypeScript", "Tailwind CSS", "React", "Vercel", "SEO"],
    githubUrl: "https://github.com/Pongeek/TileTech",
    liveUrl: "https://tile-tech.vercel.app/",
  },
];

const FALLBACK_SKILLS = [
  { id: 1,  name: "JavaScript",       category: "Frontend" },
  { id: 2,  name: "TypeScript",       category: "Frontend" },
  { id: 3,  name: "React",            category: "Frontend" },
  { id: 4,  name: "HTML/CSS",         category: "Frontend" },
  { id: 5,  name: "Tailwind CSS",     category: "Frontend" },
  { id: 6,  name: "Node.js",     category: "Backend"  },
  { id: 7,  name: "Java",        category: "Backend"  },
  { id: 8,  name: "Spring Boot", category: "Backend"  },
  { id: 9,  name: "Python",      category: "Backend"  },
  { id: 10, name: "MySQL",       category: "Database" },
  { id: 11, name: "PostgreSQL",  category: "Database" },
  { id: 12, name: "MongoDB",     category: "Database" },
  { id: 13, name: "GitHub",      category: "Tools"    },
  { id: 14, name: "RESTful API", category: "Tools"    },
  { id: 15, name: "JWT",         category: "Tools"    },
  { id: 16, name: "Docker",      category: "DevOps"   },
  { id: 17, name: "AWS",         category: "DevOps"   },
  { id: 18, name: "Linux",       category: "DevOps"   },
];

// ─── Core fetch helper ─────────────────────────────────────────────────────────

async function apiFetch(endpoint: string, options?: RequestInit) {
  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message ?? `HTTP ${response.status}`);
  }

  return response.json();
}

// ─── Public API functions ──────────────────────────────────────────────────────

export async function fetchProjects() {
  try {
    return await apiFetch("/projects");
  } catch {
    return FALLBACK_PROJECTS;
  }
}

export async function fetchSkills() {
  try {
    return await apiFetch("/skills");
  } catch {
    return FALLBACK_SKILLS;
  }
}

export async function fetchProfile() {
  try {
    return await apiFetch("/profile");
  } catch {
    return null;
  }
}

/**
 * Submit the contact form.
 * Throws on failure so the mutation's onError handler fires properly —
 * we never silently pretend a message was sent when it wasn't.
 */
export async function submitContact(data: {
  name: string;
  email: string;
  message: string;
}) {
  return apiFetch("/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(username: string, password: string) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function logout() {
  return apiFetch("/auth/logout", { method: "POST" });
}
