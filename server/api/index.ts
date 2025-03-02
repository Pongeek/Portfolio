import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

// This is the main API handler for Vercel serverless environment
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle different routes based on path
  const pathSegment = req.query.path || '';
  
  // Forward to the appropriate standalone API file
  if (pathSegment === 'projects') {
    // Import the projects API handler dynamically
    const { default: projectsHandler } = await import('../../api/projects');
    return projectsHandler(req, res);
  }
  
  if (pathSegment === 'contact') {
    // Import the contact API handler dynamically
    const { default: contactHandler } = await import('../../api/contact');
    return contactHandler(req, res);
  }

  // If no route matches
  return res.status(404).json({ error: 'API endpoint not found' });
} 