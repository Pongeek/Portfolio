import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Default skills data in case the file doesn't exist
    const defaultSkills = [
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

    let skills = defaultSkills;

    // Try to read from a skills.json file if it exists
    try {
      const filePath = path.join(process.cwd(), 'db', 'skills.json');
      if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf8');
        skills = JSON.parse(fileData);
      }
    } catch (error) {
      console.error('Error reading skills data file:', error);
      // Continue with default data
    }

    res.status(200).json(skills);
  } catch (error) {
    console.error('Error in skills API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 