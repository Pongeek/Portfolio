import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all files in the public directory
    const publicPath = path.join(process.cwd(), 'public');
    console.log('Reading directory:', publicPath);
    
    const files = fs.readdirSync(publicPath);
    
    // Get file details
    const fileDetails = files.map(file => {
      const filePath = path.join(publicPath, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        isDirectory: stats.isDirectory(),
        lastModified: stats.mtime,
        extension: path.extname(file),
        fullPath: filePath
      };
    });
    
    // Allow access from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    return res.status(200).json({
      directory: publicPath,
      fileCount: files.length,
      files: fileDetails
    });
  } catch (error) {
    console.error('Error listing files:', error);
    return res.status(500).json({ error: 'Failed to list files', details: error.message });
  }
} 