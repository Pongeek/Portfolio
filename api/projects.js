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
        description: "A modern portfolio website built with React, Express, and PostgreSQL.",
        technologies: ["React", "TypeScript", "Express", "PostgreSQL", "Tailwind CSS"],
        imageUrl: "/EAC167A1-6630-4BA0-BFE2-9B0146599AF3.png",
        github: "https://github.com/Pongeek/Portfolio",
        liveUrl: "https://portfolio-two-eta-38.vercel.app/"
      },
      {
        id: 2,
        title: "CoupCoupon",
        description: "A comprehensive platform for managing coupons and deals, featuring role-based access control for admins, companies, and customers. Built with modern web technologies. This platform enables admins to manage users and deals, companies to create and track coupons, and customers to find and redeem offers.",
        technologies: ["Java Spring", "React", "MySQL", "TypeScript", "JWT", "RestAPI"],
        imageUrl: "https://via.placeholder.com/400x300/3498db/ffffff?text=CoupCoupon",
        github: "https://github.com/username/coupcoupon",
        liveUrl: ""
      },
      {
        id: 3,
        title: "Billiard Game - Squeak Smalltalk",
        description: "An interactive billiard game implemented in Squeak Smalltalk, featuring realistic physics, collision detection, and an intuitive user interface. Players can aim and shoot using mouse controls, with the game automatically handling ball movements, collisions, and game rules.",
        technologies: ["Squeak Smalltalk", "Object-Oriented Programming", "Physics Simulation", "UI Design", "Game Development"],
        imageUrl: "https://via.placeholder.com/400x300/27ae60/ffffff?text=Billiard+Game",
        github: "https://github.com/username/billiard-game",
        liveUrl: ""
      }
    ];

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error in projects API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 