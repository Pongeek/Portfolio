import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('CV download requested');
    
    // Path to the CV file in the public directory
    const cvPath = path.join(process.cwd(), 'public', 'Max Mullokandov CV.pdf');
    console.log('Looking for CV at path:', cvPath);
    
    // List all files in the public directory for debugging
    const publicFiles = fs.readdirSync(path.join(process.cwd(), 'public'));
    console.log('Files in public directory:', publicFiles);
    
    // Check if the file exists
    if (!fs.existsSync(cvPath)) {
      console.error(`CV file not found: ${cvPath}`);
      return res.status(404).json({ error: 'CV file not found' });
    }
    
    // Read the CV file
    const cvBuffer = fs.readFileSync(cvPath);
    console.log('CV file read successfully, size:', cvBuffer.length, 'bytes');
    
    // Clear any existing headers
    res.setHeader('Content-Type', 'application/pdf');
    
    // Force download with proper filename
    res.setHeader('Content-Disposition', 'attachment; filename="Max Mullokandov CV.pdf"');
    
    // Prevent caching issues
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Allow cross-origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    // Set the file size
    res.setHeader('Content-Length', cvBuffer.length);
    
    // Log successful CV serving
    console.log('Successfully prepared CV file for download');
    
    // Send the CV
    return res.status(200).send(cvBuffer);
  } catch (error) {
    console.error('Error serving CV:', error);
    return res.status(500).json({ error: 'Failed to serve CV', details: error.message });
  }
} 