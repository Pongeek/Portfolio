const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Path to the CV file
    const cvFileName = 'Max Mullokandov CV.pdf';
    const publicDir = path.join(process.cwd(), 'public');
    const cvPath = path.join(publicDir, cvFileName);
    
    console.log(`Attempting to serve CV file from: ${cvPath}`);
    
    // Check if file exists
    if (!fs.existsSync(cvPath)) {
      console.error(`CV file not found at: ${cvPath}`);
      
      // List contents of public directory for debugging
      try {
        const publicFiles = fs.readdirSync(publicDir);
        console.log('Files in public directory:', publicFiles);
      } catch (err) {
        console.error('Error reading public directory:', err);
      }
      
      return res.status(404).json({ error: 'CV file not found' });
    }
    
    // Read file
    const fileBuffer = fs.readFileSync(cvPath);
    const stats = fs.statSync(cvPath);
    
    // Set headers to force download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Max Mullokandov CV.pdf"');
    res.setHeader('Content-Length', stats.size);
    
    // Disable caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // For debugging
    console.log('Sending CV file with headers:', {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="Max Mullokandov CV.pdf"',
      'Content-Length': stats.size
    });
    
    // Send file
    return res.status(200).send(fileBuffer);
  } catch (error) {
    console.error('Error serving CV file:', error);
    return res.status(500).json({ 
      error: 'Failed to serve CV file',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}; 