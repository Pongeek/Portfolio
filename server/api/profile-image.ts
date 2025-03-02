import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Path to the profile image - adjust this path based on your project structure
    const imagePath = path.join(process.cwd(), 'public', 'profile.jpg');
    
    // Check if the file exists
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'Profile image not found' });
    }
    
    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
    
    // Send the image
    return res.status(200).send(imageBuffer);
  } catch (error) {
    console.error('Error serving profile image:', error);
    return res.status(500).json({ error: 'Failed to serve profile image' });
  }
} 