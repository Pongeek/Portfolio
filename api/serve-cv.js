import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Path to the CV file in the public directory
    const cvPath = path.join(process.cwd(), 'public', 'Max Mullokandov CV.pdf');
    
    // Check if the file exists
    if (!fs.existsSync(cvPath)) {
      console.error(`CV file not found: ${cvPath}`);
      return res.status(404).json({ error: 'CV file not found' });
    }
    
    // Read the CV file
    const cvBuffer = fs.readFileSync(cvPath);
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Max Mullokandov CV.pdf"');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Log successful CV serving
    console.log('Successfully served CV file');
    
    // Send the CV
    return res.status(200).send(cvBuffer);
  } catch (error) {
    console.error('Error serving CV:', error);
    return res.status(500).json({ error: 'Failed to serve CV' });
  }
} 