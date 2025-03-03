export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Default projects data
    const projects = [
      {
        id: 1,
        title: "Portfolio Website",
        description: "A modern portfolio website built with React, Express, and PostgreSQL",
        technologies: ["React", "TypeScript", "Express", "PostgreSQL", "Tailwind CSS"],
        imageUrl: "/images/portfolio.webp",
        github: "https://github.com/Pongeek/Portfolio",
        liveUrl: "https://portfolio-two-eta-38.vercel.app/"
      },
      {
        id: 2,
        title: "E-commerce Platform",
        description: "Full-featured e-commerce platform with product listings, cart, and checkout functionality",
        technologies: ["React", "Node.js", "MongoDB", "Express", "Redux"],
        imageUrl: "/images/ecommerce.webp",
        github: "https://github.com/example/ecommerce",
        liveUrl: "https://example-ecommerce.com"
      },
      {
        id: 3,
        title: "Task Management App",
        description: "Collaborative task management application with real-time updates",
        technologies: ["React", "Firebase", "Material UI", "Redux"],
        imageUrl: "/images/taskapp.webp",
        github: "https://github.com/example/taskapp",
        liveUrl: "https://example-taskapp.com"
      }
    ];

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error in projects API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 