export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get base URL for images and assets
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000'
        : '';
        
    // Profile data
    const profile = {
      name: "Max Mullokandov",
      title: "Full Stack Developer",
      bio: "Passionate developer with expertise in modern web technologies. I create robust, scalable applications with clean, maintainable code.",
      location: "New York, NY",
      email: "contact@example.com",
      github: "https://github.com/Pongeek",
      linkedin: "https://linkedin.com/in/example",
      resume: `${baseUrl}/api/serve-cv`,
      experience: [
        {
          title: "Senior Developer",
          company: "Tech Solutions Inc.",
          period: "2021 - Present",
          description: "Led development of enterprise web applications using React, Node.js, and PostgreSQL."
        },
        {
          title: "Full Stack Developer",
          company: "Digital Innovations",
          period: "2018 - 2021",
          description: "Developed and maintained RESTful APIs and responsive web interfaces for clients."
        }
      ]
    };
    
    // Add CORS headers to allow resources to be loaded from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    
    return res.status(200).json(profile);
  } catch (error) {
    console.error('Error in profile API:', error);
    return res.status(500).json({ error: 'Failed to fetch profile data' });
  }
} 