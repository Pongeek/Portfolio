export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Default skills data
    const skills = [
      { name: "JavaScript", level: 90, category: "Frontend" },
      { name: "TypeScript", level: 85, category: "Frontend" },
      { name: "React", level: 90, category: "Frontend" },
      { name: "Node.js", level: 85, category: "Backend" },
      { name: "Express", level: 80, category: "Backend" },
      { name: "SQL", level: 75, category: "Database" },
      { name: "MongoDB", level: 70, category: "Database" },
      { name: "HTML/CSS", level: 95, category: "Frontend" },
      { name: "Git", level: 85, category: "Tools" },
      { name: "Docker", level: 70, category: "DevOps" }
    ];

    res.status(200).json(skills);
  } catch (error) {
    console.error('Error in skills API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 