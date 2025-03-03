import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const imagesToCheck = [
      '/EAC167A1-6630-4BA0-BFE2-9B0146599AF3.png',
      '/Coupon.png',
      '/billiardTable.png'
    ];

    const results = {};
    
    // Check if images exist in the public directory
    for (const imagePath of imagesToCheck) {
      const fullPath = path.join(process.cwd(), 'public', imagePath);
      results[imagePath] = {
        exists: fs.existsSync(fullPath),
        path: fullPath,
        size: fs.existsSync(fullPath) ? fs.statSync(fullPath).size : null
      };
    }

    // Also include environment info for debugging
    const environmentInfo = {
      nodePath: process.env.PATH,
      cwd: process.cwd(),
      vercelUrl: process.env.VERCEL_URL || 'Not defined',
      publicDir: fs.existsSync(path.join(process.cwd(), 'public')) 
        ? 'Exists' 
        : 'Does not exist',
      publicDirContents: fs.existsSync(path.join(process.cwd(), 'public')) 
        ? fs.readdirSync(path.join(process.cwd(), 'public')) 
        : []
    };

    res.status(200).json({
      images: results,
      environment: environmentInfo
    });
  } catch (error) {
    console.error('Error checking images:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
} 