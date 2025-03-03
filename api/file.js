const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the file path from the query parameter
    const filePath = req.query.path;
    const forceDownload = req.query.download === 'true';
    
    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
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
      
      // Check if the file exists with spaces replaced by %20
      const encodedPath = filePath.replace(/%20/g, ' ');
      const encodedFullPath = path.join(publicDir, encodedPath);
      
      if (fs.existsSync(encodedFullPath)) {
        console.log(`Found encoded version: ${encodedFullPath}`);
        fullPath = encodedFullPath;
      } else {
        // Try lowercase version as a fallback
        const lowercasePath = path.join(publicDir, filePath.toLowerCase());
        if (fs.existsSync(lowercasePath)) {
          console.log(`Found lowercase version: ${lowercasePath}`);
          fullPath = lowercasePath;
        } else {
          return res.status(404).json({ 
            error: 'File not found',
            requestedPath: filePath,
            fullPath: fullPath,
            encodedPath: encodedFullPath
          });
        }
      }
    }
    
    // Read the file
    const fileBuffer = fs.readFileSync(fullPath);
    const stats = fs.statSync(fullPath);
    
    // Get file extension and determine content type
    const ext = path.extname(fullPath).toLowerCase();
    let contentType = 'application/octet-stream'; // Default
    
    // Set content type based on file extension
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg', 
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.html': 'text/html',
      '.txt': 'text/plain',
      '.css': 'text/css',
      '.js': 'text/javascript'
    };
    
    if (mimeTypes[ext]) {
      contentType = mimeTypes[ext];
    }
    
    // Set headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // If forcing download or if it's a PDF, add Content-Disposition header
    if (forceDownload || ext === '.pdf') {
      const fileName = path.basename(fullPath);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    }
    
    // Add caching for images but not for PDFs
    if (['.png', '.jpg', '.jpeg', '.gif', '.svg'].includes(ext)) {
      res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    } else {
      // Disable caching for other files
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
    
    // Log serving details
    console.log(`Serving file: ${fullPath} (${contentType}, size: ${stats.size} bytes)`);
    
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