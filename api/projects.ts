import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

// This function will read the projects from the JSON file
// This approach works better for Vercel's read-only filesystem
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Try multiple potential locations for the projects.json file
    let projectsPath = path.join(process.cwd(), 'db', 'projects.json');
    
    // If the file doesn't exist in the first location, try the public directory
    if (!fs.existsSync(projectsPath)) {
      projectsPath = path.join(process.cwd(), 'public', 'db', 'projects.json');
    }
    
    // If it still doesn't exist, try the api/db directory
    if (!fs.existsSync(projectsPath)) {
      projectsPath = path.join(process.cwd(), 'api', 'db', 'projects.json');
    }
    
    // Read projects from the JSON file
    const projectsData = fs.readFileSync(projectsPath, 'utf8');
    const projects = JSON.parse(projectsData);

    return res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ error: 'Failed to fetch projects', details: (error as Error).message });
  }
} 