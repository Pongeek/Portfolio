const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the image path from the query parameter
    const imagePath = req.query.path;
    
    if (!imagePath) {
      return res.status(400).json({ error: 'Image path is required' });
    }
    
    // For security, validate the filename to prevent directory traversal
    if (imagePath.includes('..') || imagePath.includes('/')) {
      return res.status(400).json({ error: 'Invalid image path' });
    }
    
    // Build the full path to the image
    const publicDir = path.join(process.cwd(), 'public');
    const fullPath = path.join(publicDir, imagePath);
    
    console.log(`Attempting to serve image: ${fullPath}`);
    
    // Check if the file exists
    if (!fs.existsSync(fullPath)) {
      console.log(`Image not found: ${fullPath}`);
      
      // Try lowercase version as a fallback
      const lowercasePath = path.join(publicDir, imagePath.toLowerCase());
      if (fs.existsSync(lowercasePath)) {
        console.log(`Found lowercase version: ${lowercasePath}`);
        return serveImage(lowercasePath, res);
      }
      
      return res.status(404).json({ error: 'Image not found' });
    }
    
    return serveImage(fullPath, res);
  } catch (error) {
    console.error('Error serving image:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

function serveImage(filePath, res) {
  try {
    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Get file extension
    const ext = path.extname(filePath).toLowerCase();
    
    // Set content type based on file extension
    let contentType = 'application/octet-stream';
    if (ext === '.png') contentType = 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    if (ext === '.gif') contentType = 'image/gif';
    if (ext === '.svg') contentType = 'image/svg+xml';
    if (ext === '.webp') contentType = 'image/webp';
    
    // Set headers for the response
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', fileBuffer.length);
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Send the file
    return res.status(200).send(fileBuffer);
  } catch (error) {
    console.error('Error in serveImage:', error);
    return res.status(500).json({ error: 'Failed to serve image' });
  }
} 