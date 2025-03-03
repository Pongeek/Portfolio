import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    console.log('Image check API endpoint called');
    
    // Path to the public directory
    const publicPath = path.join(process.cwd(), 'public');
    console.log('Public directory path:', publicPath);
    
    // Define the image files we're looking for
    const imageFiles = [
      'EAC167A1-6630-4BA0-BFE2-9B0146599AF3.png',
      'Coupon.png',
      'coupon.png', // Check lowercase variant
      'billiardTable.png',
      'billiardtable.png', // Check lowercase variant
      'Max Mullokandov CV.pdf'
    ];
    
    // Check each file
    const results = {};
    
    for (const file of imageFiles) {
      const filePath = path.join(publicPath, file);
      const exists = fs.existsSync(filePath);
      
      let fileInfo = { exists };
      
      if (exists) {
        const stats = fs.statSync(filePath);
        fileInfo = {
          ...fileInfo,
          size: stats.size,
          lastModified: stats.mtime.toISOString(),
          isDirectory: stats.isDirectory()
        };
      }
      
      results[file] = fileInfo;
    }
    
    // List all files in the public directory
    const allFiles = fs.readdirSync(publicPath);
    const fileDetails = allFiles.map(file => {
      const filePath = path.join(publicPath, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        lastModified: stats.mtime.toISOString(),
        isDirectory: stats.isDirectory()
      };
    });
    
    // Send the results
    return res.status(200).json({
      publicPath,
      results,
      allFiles: fileDetails,
      serverTimestamp: new Date().toISOString(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'unknown'
    });
  } catch (error) {
    console.error('Error checking image files:', error);
    return res.status(500).json({ error: 'Failed to check image files', details: error.message });
  }
} 