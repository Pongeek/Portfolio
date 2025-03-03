import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the image name from the query parameter
    const { name } = req.query;
    
    console.log('Image name requested:', name);
    
    if (!name) {
      return res.status(400).json({ error: 'Image name is required' });
    }
    
    // Sanitize the filename to prevent directory traversal attacks
    const sanitizedName = name.replace(/\.\./g, '').replace(/[/\\]/g, '');
    console.log('Sanitized name:', sanitizedName);
    
    // Determine content type based on file extension
    const ext = path.extname(sanitizedName).toLowerCase();
    let contentType = 'application/octet-stream'; // Default content type
    
    if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.gif') {
      contentType = 'image/gif';
    } else if (ext === '.webp') {
      contentType = 'image/webp';
    } else if (ext === '.svg') {
      contentType = 'image/svg+xml';
    }
    
    console.log('Content type:', contentType);
    
    // Path to the image in the public directory
    const imagePath = path.join(process.cwd(), 'public', sanitizedName);
    console.log('Looking for image at path:', imagePath);
    
    // List all files in the public directory for debugging
    const publicFiles = fs.readdirSync(path.join(process.cwd(), 'public'));
    console.log('Files in public directory:', publicFiles);
    
    // Check if the file exists
    if (!fs.existsSync(imagePath)) {
      console.error(`Image not found: ${imagePath}`);
      return res.status(404).json({ error: 'Image not found' });
    }
    
    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Set appropriate headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Log successful image serving
    console.log(`Successfully served image: ${sanitizedName}`);
    
    // Send the image
    return res.status(200).send(imageBuffer);
  } catch (error) {
    console.error('Error serving image:', error);
    return res.status(500).json({ error: 'Failed to serve image' });
  }
} 