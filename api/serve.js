const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, path: filePath } = req.query;
    
    if (!type || !filePath) {
      return res.status(400).json({ error: 'Type and path parameters are required' });
    }
    
    // For security, validate the filename to prevent directory traversal
    if (filePath.includes('..')) {
      return res.status(400).json({ error: 'Invalid file path' });
    }
    
    // Build the full path to the file
    const publicDir = path.join(process.cwd(), 'public');
    let fullPath = path.join(publicDir, filePath);
    
    console.log(`Attempting to serve file: ${fullPath}`);
    
    // Check if the file exists
    if (!fs.existsSync(fullPath)) {
      console.log(`File not found: ${fullPath}`);
      
      // Try variations of the path
      const variations = [
        fullPath,
        path.join(publicDir, filePath.toLowerCase()),
        path.join(publicDir, filePath.replace(/%20/g, ' ')),
        path.join(publicDir, decodeURIComponent(filePath))
      ];
      
      const existingPath = variations.find(p => fs.existsSync(p));
      
      if (!existingPath) {
        return res.status(404).json({ 
          error: 'File not found',
          requestedPath: filePath,
          triedPaths: variations
        });
      }
      
      fullPath = existingPath;
    }
    
    // Read the file
    const fileBuffer = fs.readFileSync(fullPath);
    const stats = fs.statSync(fullPath);
    
    // Get file extension and determine content type
    const ext = path.extname(fullPath).toLowerCase();
    
    // Set content type based on file extension
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp'
    };
    
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    // Set basic headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Handle different types of files
    switch (type) {
      case 'image':
        // For images, enable caching and don't force download
        res.setHeader('Cache-Control', 'public, max-age=3600');
        break;
        
      case 'download':
        // For downloads (like CV), force download and disable caching
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(fullPath)}"`);
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid file type' });
    }
    
    // Send the file
    return res.status(200).send(fileBuffer);
  } catch (error) {
    console.error('Error serving file:', error);
    return res.status(500).json({ 
      error: 'Failed to serve file',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}; 