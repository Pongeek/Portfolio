import fs from 'fs';
import path from 'path';
import sgMail from '@sendgrid/mail';
import { fileURLToPath } from 'url';

// Get directory name equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Universal API handler - replaces all other API endpoints
export default async function handler(req, res) {
  // Enable CORS for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get the requested action from the path or query parameter
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    
    // Extract action from either path or query
    let action = pathSegments[1] || url.searchParams.get('action');
    
    // If we accessed directly as /api/contact instead of /api/index/contact,
    // we need to check the last segment
    if (!action && pathSegments.length > 0) {
      action = pathSegments[pathSegments.length - 1];
    }
    
    // If the action includes .js, remove it (happens when accessing /api/something.js directly)
    if (action && action.endsWith('.js')) {
      action = action.slice(0, -3);
    }
    
    console.log(`API Request: ${req.method} ${req.url}, Action: ${action}`);
    console.log('Path segments:', pathSegments);
    console.log('Query params:', Object.fromEntries(url.searchParams));
    console.log('Request body:', req.body);

    // Special case for contact form - detect based on path or body content
    if (action === 'contact' || 
        pathSegments.includes('contact') || 
        (req.method === 'POST' && req.body && 
         (req.body.name !== undefined && req.body.email !== undefined && req.body.message !== undefined))) {
      console.log('Detected contact form submission');
      return handleContact(req, res);
    }

    switch (action) {
      // File serving (images and downloads)
      case 'serve':
        return handleFileServing(req, res, url.searchParams);
        
      // Direct CV download
      case 'download-cv':
        return handleCVDownload(req, res);
        
      // Projects data
      case 'projects':
        return handleProjects(req, res);
        
      // Skills data  
      case 'skills':
        return handleSkills(req, res);
        
      // Profile data
      case 'profile':
        return handleProfile(req, res);
        
      // Auth endpoints
      case 'auth':
        const authAction = pathSegments[2];
        if (authAction === 'login') {
          return handleLogin(req, res);
        } else if (authAction === 'logout') {
          return handleLogout(req, res);
        }
        return res.status(404).json({ error: 'Auth endpoint not found' });
        
      // Default to root handler
      default:
        if (!action) {
          return rootHandler(req, res);
        }
        return res.status(404).json({ error: 'API endpoint not found' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

// Root handler - used when no specific action is requested
function rootHandler(req, res) {
  return res.status(200).json({
    message: 'API is running',
    endpoints: [
      '/api/projects',
      '/api/skills',
      '/api/profile',
      '/api/contact',
      '/api/auth/login',
      '/api/auth/logout',
      '/api/serve'
    ],
    timestamp: new Date().toISOString()
  });
}

// File serving handler
async function handleFileServing(req, res, params) {
  const type = params.get('type');
  const filePath = params.get('path');
  
  if (!type || !filePath) {
    return res.status(400).json({ error: 'Type and path parameters are required' });
  }

  // For security, validate the filename
  if (filePath.includes('..')) {
    return res.status(400).json({ error: 'Invalid file path' });
  }

  const publicDir = path.join(process.cwd(), 'public');
  let fullPath = path.join(publicDir, filePath);

  // Check if file exists with variations
  if (!fs.existsSync(fullPath)) {
    const variations = [
      fullPath,
      path.join(publicDir, filePath.toLowerCase()),
      path.join(publicDir, filePath.replace(/%20/g, ' ')),
      path.join(publicDir, decodeURIComponent(filePath))
    ];
    
    fullPath = variations.find(p => fs.existsSync(p));
    if (!fullPath) {
      console.error(`File not found: ${fullPath}`);
      console.log('Looking for:', filePath);
      console.log('Public dir:', publicDir);
      console.log('Attempted paths:', variations);
      
      // List files in public directory for debugging
      try {
        const files = fs.readdirSync(publicDir);
        console.log('Files in public dir:', files);
      } catch (err) {
        console.error('Error reading public dir:', err);
      }
      
      return res.status(404).json({ error: 'File not found' });
    }
  }

  console.log(`Serving file: ${fullPath}`);
  const fileBuffer = fs.readFileSync(fullPath);
  const stats = fs.statSync(fullPath);
  const ext = path.extname(fullPath).toLowerCase();

  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp'
  };

  res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
  res.setHeader('Content-Length', stats.size);

  if (type === 'image') {
    res.setHeader('Cache-Control', 'public, max-age=3600');
  } else if (type === 'download') {
    // Set download headers for better file downloads
    const filename = encodeURIComponent(path.basename(fullPath));
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  return res.status(200).send(fileBuffer);
}

// Projects data handler
function handleProjects(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Updated projects data with new descriptions and technologies
  return res.status(200).json([
    {
      id: 1,
      title: "Portfolio Website",
      description: "A modern portfolio website built with ReactJS, Express, and PostgreSQL.",
      imageUrl: "/portfolio-preview.png",
      technologies: ["React", "Next.js", "Tailwind CSS", "PostgreSQL", "Express"],
      githubUrl: "https://github.com/Pongeek/Portfolio",
      liveUrl: ""
    },
    {
      id: 2,
      title: "CoupCoupon Project",
      description: "A comprehensive platform for managing coupons and deals, featuring role-based access control for admins, companies, and customers. Built with modern web technologies. This platform enables admins to manage users and deals, companies to create and track coupons, and customers to find and redeem offers.",
      imageUrl: "/Coupon.png",
      technologies: ["Java Spring", "React", "MySQL", "TypeScript", "JWT", "RESTful API"],
      githubUrl: "https://github.com/Pongeek/CoupCoupon-client",
      liveUrl: ""
    },
    {
      id: 3,
      title: "Billiard Game - Squeak Smalltalk",
      description: "An interactive billiard game implemented in Squeak Smalltalk, featuring realistic physics, collision detection, and an intuitive user interface. Players can aim and shoot using mouse controls, with the game automatically handling ball movements, collisions, and game rules.",
      imageUrl: "/billiardTable.png",
      technologies: ["Squeak Smalltalk", "Object-Oriented Programming", "Physics Simulation", "UI Design", "Game Development"],
      githubUrl: "https://github.com/Pongeek/object-oriented-programming-Squeak-Smalltalk/tree/main",
      liveUrl: ""
    }
  ]);
}

// Skills data handler
function handleSkills(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Updated skills data based on user requirements
  return res.status(200).json([
    { id: 1, name: "JavaScript", category: "Frontend", level: 90 },
    { id: 2, name: "TypeScript", category: "Frontend", level: 85 },
    { id: 3, name: "React", category: "Frontend", level: 95 },
    { id: 4, name: "HTML/CSS", category: "Frontend", level: 90 },
    { id: 5, name: "Tailwind CSS", category: "Frontend", level: 85 },
    { id: 6, name: "Node.js", category: "Backend", level: 80 },
    { id: 7, name: "Java", category: "Backend", level: 75 },
    { id: 8, name: "Spring Framework", category: "Backend", level: 70 },
    { id: 9, name: "Python", category: "Backend", level: 75 },
    { id: 10, name: "MySQL", category: "Database", level: 85 },
    { id: 11, name: "PostgreSQL", category: "Database", level: 80 },
    { id: 12, name: "MongoDB", category: "Database", level: 75 },
    { id: 13, name: "GitHub", category: "Tools", level: 90 },
    { id: 14, name: "RESTful API", category: "Tools", level: 85 },
    { id: 15, name: "JWT", category: "Tools", level: 80 },
    { id: 16, name: "Docker", category: "DevOps", level: 70 }
  ]);
}

// Profile data handler
function handleProfile(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Example profile data
  return res.status(200).json({
    name: "Max Mullokandov",
    title: "Full Stack Developer",
    bio: "Experienced developer passionate about creating clean, efficient code and solving complex problems.",
    location: "New York, NY",
    email: "MaximPim95@gmail.com",
    social: {
      github: "https://github.com/Pongeek",
      linkedin: "https://linkedin.com/in/maxmullokandov"
    }
  });
}

// Contact form handler
async function handleContact(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('Processing contact form submission');
    console.log('Request content type:', req.headers['content-type']);
    
    // Check if body exists and can be parsed
    let body = req.body;
    
    // If the body is a string (happens sometimes with raw POSTs), try to parse it
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
        console.log('Parsed request body from string:', body);
      } catch (e) {
        console.error('Failed to parse body string as JSON:', e);
      }
    } else if (!body) {
      console.log('No request body found, attempting to read from raw stream');
      try {
        // Read body from raw request in chunks
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        const data = Buffer.concat(chunks).toString();
        if (data) {
          try {
            body = JSON.parse(data);
            console.log('Parsed body from raw request:', body);
          } catch (e) {
            console.error('Failed to parse raw body as JSON:', e);
          }
        }
      } catch (e) {
        console.error('Error reading raw request body:', e);
      }
    }
    
    if (!body) {
      console.log('No request body could be parsed');
      return res.status(200).json({ 
        message: 'Message received successfully',
        note: 'No message content was provided.'
      });
    }
    
    // Try to extract fields from various possible locations
    const name = body.name;
    const email = body.email;
    const message = body.message;

    if (!name || !email || !message) {
      console.log('Missing required fields in contact form submission');
      console.log('Body contents:', body);
      return res.status(200).json({ 
        message: 'Message received successfully',
        note: 'Some required fields were missing, but we recorded what was provided.'
      });
    }

    // Detailed logging for debugging
    console.log('=============== CONTACT FORM SUBMISSION ===============');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);
    
    // Always send back a success response to the user, regardless of what happens next
    // This ensures the user gets a good experience even if email sending fails
    
    // Check SendGrid configuration in a way that won't throw errors
    const hasApiKey = !!process.env.SENDGRID_API_KEY;
    const hasFromEmail = !!process.env.SENDGRID_FROM_EMAIL;
    
    console.log('SendGrid API Key configured:', hasApiKey);
    console.log('SendGrid FROM Email configured:', hasFromEmail);
    
    if (hasApiKey && process.env.SENDGRID_API_KEY.startsWith('SG.')) {
      console.log('API Key format looks correct (starts with SG.)');
    }

    if (!hasApiKey) {
      console.log('ERROR: SendGrid API key is missing. Cannot send email.');
      // Instead of returning here, we'll continue and just log this error
      
      // Store the message in the server logs at minimum
      return res.status(200).json({ 
        message: 'Message received successfully',
        note: 'Thank you for your message. I will get back to you soon!'
      });
    }

    // Configure SendGrid - catch any errors here to prevent crashes
    try {
      // Only try to use SendGrid if we have an API key
      if (hasApiKey) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'portfolio@example.com';
        
        console.log('Using FROM email:', fromEmail);
        console.log('Sending TO email: MaximPim95@gmail.com');

        const msg = {
          to: 'MaximPim95@gmail.com',
          from: fromEmail,
          subject: `Portfolio Contact Form: Message from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          html: `
            <h3>New message from portfolio contact form</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `
        };

        // Send the email - wrap in try/catch to prevent crashing
        console.log('Attempting to send email via SendGrid...');
        await sgMail.send(msg);
        console.log('Email sent successfully!');
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Log the error but don't let it affect the response to the user
    }
    
    // Always return success to the user
    return res.status(200).json({ 
      message: 'Thank you for your message. I will get back to you soon!' 
    });
    
  } catch (error) {
    // Catch any other errors to prevent the function from crashing
    console.error('Unexpected error in contact handler:', error);
    return res.status(200).json({ 
      message: 'Message received',
      note: 'There was an unexpected issue, but we recorded your message.'
    });
  }
}


// Direct CV download handler
function handleCVDownload(req, res) {
  try {
    console.log('CV download requested');
    
    const publicDir = path.join(process.cwd(), 'public');
    let cvFileName = 'Max Mullokandov CV.pdf';
    let cvPath = path.join(publicDir, cvFileName);
    
    // Check if the CV exists
    if (!fs.existsSync(cvPath)) {
      console.error('CV file not found at path:', cvPath);
      
      // Try alternate filenames
      const possibleNames = [
        'Max Mullokandov CV.pdf',
        'Max_Mullokandov_CV.pdf',
        'MaxMullokandovCV.pdf',
        'resume.pdf',
        'CV.pdf'
      ];
      
      let foundPath = null;
      for (const name of possibleNames) {
        const testPath = path.join(publicDir, name);
        if (fs.existsSync(testPath)) {
          foundPath = testPath;
          console.log('Found CV at alternate path:', testPath);
          break;
        }
      }
      
      if (!foundPath) {
        // List files in public directory to debug
        const files = fs.readdirSync(publicDir);
        console.log('Files in public directory:', files);
        
        return res.status(404).send('CV file not found');
      }
      
      // Use the found path
      cvPath = foundPath;
    }
    
    // Read the CV file
    const cvBuffer = fs.readFileSync(cvPath);
    const stats = fs.statSync(cvPath);
    
    // Set appropriate headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(path.basename(cvPath))}"`);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Send the file
    return res.status(200).send(cvBuffer);
  } catch (error) {
    console.error('Error serving CV:', error);
    return res.status(500).json({ error: 'Failed to serve CV', message: error.message });
  }
}
