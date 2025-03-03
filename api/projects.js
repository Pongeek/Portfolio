export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get base URL for static files
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000'
        : '';
    
    console.log('Using base URL for projects:', baseUrl);
    
    // Default projects data
    const projects = [
      {
        id: 1,
        title: "Portfolio Website",
        description: "A modern portfolio website built with React, Express, and PostgreSQL.",
        technologies: ["React", "TypeScript", "Express", "PostgreSQL", "Tailwind CSS"],
        // Direct URL to the static file in the public directory
        imageUrl: `${baseUrl}/EAC167A1-6630-4BA0-BFE2-9B0146599AF3.png`,
        githubUrl: "https://github.com/Pongeek/Portfolio",
        liveUrl: "https://portfolio-two-eta-38.vercel.app/"
      },
      {
        id: 2,
        title: "CoupCoupon",
        description: "A comprehensive platform for managing coupons and deals, featuring role-based access control for admins, companies, and customers. Built with modern web technologies. This platform enables admins to manage users and deals, companies to create and track coupons, and customers to find and redeem offers.",
        technologies: ["Java Spring", "React", "MySQL", "TypeScript", "JWT", "RestAPI"],
        // Direct URL to the static file in the public directory
        imageUrl: `${baseUrl}/Coupon.png`,
        githubUrl: "https://github.com/Pongeek/CoupCoupon-client",
        liveUrl: ""
      },
      {
        id: 3,
        title: "Billiard Game - Squeak Smalltalk",
        description: "An interactive billiard game implemented in Squeak Smalltalk, featuring realistic physics, collision detection, and an intuitive user interface. Players can aim and shoot using mouse controls, with the game automatically handling ball movements, collisions, and game rules.",
        technologies: ["Squeak Smalltalk", "Object-Oriented Programming", "Physics Simulation", "UI Design", "Game Development"],
        // Direct URL to the static file in the public directory
        imageUrl: `${baseUrl}/billiardTable.png`,
        githubUrl: "https://github.com/Pongeek/object-oriented-programming-Squeak-Smalltalk",
        liveUrl: ""
      }
    ];

    // Add CORS headers to allow resources to be loaded from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    
    // Log the image URLs for debugging
    console.log('Serving projects with image URLs:', projects.map(p => p.imageUrl));
    
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error in projects API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 