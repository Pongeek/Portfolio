import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Default profile data in case the file doesn't exist
    const defaultProfile = {
      name: "Max Developer",
      title: "Full Stack Developer",
      bio: "Passionate developer with expertise in modern web technologies. I create robust, scalable applications with clean, maintainable code.",
      location: "New York, NY",
      email: "contact@example.com",
      github: "https://github.com/Pongeek",
      linkedin: "https://linkedin.com/in/example",
      resume: "/resume.pdf",
      experience: [
        {
          title: "Senior Developer",
          company: "Tech Solutions Inc.",
          period: "2021 - Present",
          description: "Leading development of enterprise applications using React, Node.js, and TypeScript."
        },
        {
          title: "Web Developer",
          company: "Digital Innovations",
          period: "2019 - 2021",
          description: "Developed responsive web applications and maintained client websites."
        }
      ]
    };

    let profile = defaultProfile;

    // Try to read from a profile.json file if it exists
    try {
      const filePath = path.join(process.cwd(), 'db', 'profile.json');
      if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf8');
        profile = JSON.parse(fileData);
      }
    } catch (error) {
      console.error('Error reading profile data file:', error);
      // Continue with default data
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Error in profile API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 