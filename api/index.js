import fs from 'fs';
import path from 'path';
import sgMail from '@sendgrid/mail';
import { fileURLToPath } from 'url';

// Get directory name equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Security helpers ──────────────────────────────────────────────────────────

/** HTML-encode user-supplied strings before putting them in email HTML. */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Simple email-format check (same rules as express-validator's isEmail). */
function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── In-memory rate limiter for the contact form ──────────────────────────────
// Allows 3 submissions per IP per 15-minute window (mirrors server/routes.ts).
const RATE_WINDOW_MS  = 15 * 60 * 1000; // 15 min
const RATE_MAX        = 3;
const rateLimitMap    = new Map();        // ip -> { count, resetAt }

function checkRateLimit(ip) {
  const now   = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true };
  }
  if (entry.count >= RATE_MAX) {
    return { allowed: false, resetAt: entry.resetAt };
  }
  entry.count++;
  return { allowed: true };
}

// Universal API handler - replaces all other API endpoints
export default async function handler(req, res) {
  // Restrict CORS to the production origin (or a dev override via env var)
  const allowedOrigin = process.env.ALLOWED_ORIGIN ?? 'https://maxmullo.com';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
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

// Projects data handler - reads db/projects.json (single source of truth),
// falls back to inline data if the file isn't available.
function handleProjects(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Try to read from the canonical JSON file first
  try {
    const candidates = [
      path.join(process.cwd(), 'db', 'projects.json'),
      path.join(__dirname, '..', 'db', 'projects.json'),
      path.join(__dirname, 'db', 'projects.json'),
    ];
    for (const jsonPath of candidates) {
      if (fs.existsSync(jsonPath)) {
        const { projects: jsonProjects } = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        return res.status(200).json(
          jsonProjects.map((p, i) => ({
            id: i + 1,
            title: p.title,
            description: p.description,
            technologies: Array.isArray(p.technologies) ? p.technologies : [],
            imageUrl: p.imageUrl ?? null,
            liveUrl: p.liveUrl ?? '',
            githubUrl: p.githubUrl,
            createdAt: p.createdAt ?? null,
          }))
        );
      }
    }
  } catch (err) {
    console.error('Failed to read projects.json, using inline fallback:', err);
  }

  // Inline fallback - keep this in sync with db/projects.json
  return res.status(200).json([
    {
      id: 1,
      title: "Portfolio Website",
      description: "Full-stack portfolio built with React 18, TypeScript, and Express. Features a PostgreSQL backend with Drizzle ORM, serverless deployment to Vercel, dark/light theming with zero flash, and a rate-limited contact form with server-side validation.",
      imageUrl: "/max-profile.png",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Express", "PostgreSQL"],
      githubUrl: "https://github.com/Pongeek/Portfolio",
      liveUrl: "https://maxmullo.com"
    },
    {
      id: 2,
      title: "CoupCoupon",
      description: "Role-based coupon management system with three distinct user tiers: Admin, Company, and Customer. Java Spring Boot backend exposes a RESTful API secured with JWT. React/TypeScript frontend consumes the API with dynamic dashboards per role, backed by a MySQL database.",
      imageUrl: "/Coupon.png",
      technologies: ["Java Spring", "React", "TypeScript", "MySQL", "JWT", "RESTful API"],
      githubUrl: "https://github.com/Pongeek/CoupCoupon-client",
      liveUrl: ""
    },
    {
      id: 3,
      title: "Billiard Game - Squeak Smalltalk",
      description: "Object-oriented billiard game built from scratch in Squeak Smalltalk. Implements real-time elastic collision physics, mouse-driven trajectory aiming, game-state management, and a clean separation between the physics engine and UI rendering layers.",
      imageUrl: "/billiardTable.png",
      technologies: ["Squeak Smalltalk", "OOP", "Physics Simulation", "Game Development"],
      githubUrl: "https://github.com/Pongeek/object-oriented-programming-Squeak-Smalltalk/tree/main",
      liveUrl: ""
    },
    {
      id: 4,
      title: "TileTech",
      description: "Professional business website for a tiling and renovation company serving central Israel. Built with Next.js 14 App Router and TypeScript - features bilingual RTL/LTR support for Hebrew and English, SEO optimization with JSON-LD structured data and automatic sitemap generation, image optimization with WebP/AVIF conversion, and a validated contact form. Deployed to Vercel.",
      imageUrl: "/tiletech-preview.png",
      technologies: ["Next.js 14", "TypeScript", "Tailwind CSS", "React", "Vercel", "SEO"],
      githubUrl: "https://github.com/Pongeek/TileTech",
      liveUrl: "https://tile-tech.vercel.app/"
    }
  ]);
}

// Skills data handler
function handleSkills(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Canonical skills list - keep in sync with server/index.ts CANONICAL_SKILLS
  return res.status(200).json([
    { id: 1,  name: "JavaScript",   category: "Frontend" },
    { id: 2,  name: "TypeScript",   category: "Frontend" },
    { id: 3,  name: "React",        category: "Frontend" },
    { id: 4,  name: "HTML/CSS",     category: "Frontend" },
    { id: 5,  name: "Tailwind CSS", category: "Frontend" },
    { id: 6,  name: "Node.js",      category: "Backend"  },
    { id: 7,  name: "Java",         category: "Backend"  },
    { id: 8,  name: "Spring Boot",  category: "Backend"  },
    { id: 9,  name: "Python",       category: "Backend"  },
    { id: 10, name: "MySQL",        category: "Database" },
    { id: 11, name: "PostgreSQL",   category: "Database" },
    { id: 12, name: "MongoDB",      category: "Database" },
    { id: 13, name: "GitHub",       category: "Tools"    },
    { id: 14, name: "RESTful API",  category: "Tools"    },
    { id: 15, name: "JWT",          category: "Tools"    },
    { id: 16, name: "Docker",       category: "DevOps"   },
    { id: 17, name: "AWS",          category: "DevOps"   },
    { id: 18, name: "Linux",        category: "DevOps"   }
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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Rate limiting ────────────────────────────────────────────────────────────
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ?? req.socket?.remoteAddress ?? 'unknown';
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    const retryAfterSec = Math.ceil((rateCheck.resetAt - Date.now()) / 1000);
    res.setHeader('Retry-After', retryAfterSec);
    return res.status(429).json({
      error: 'Too many requests',
      message: `Please wait ${Math.ceil(retryAfterSec / 60)} minute(s) before submitting again.`,
    });
  }

  try {
    // ── Parse body (Vercel sometimes delivers it pre-parsed, sometimes raw) ───
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { /* fall through */ }
    } else if (!body) {
      try {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const raw = Buffer.concat(chunks).toString();
        if (raw) body = JSON.parse(raw);
      } catch { /* fall through */ }
    }

    if (!body) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    // ── Input validation (mirrors server/routes.ts rules) ────────────────────
    const { name, email, message } = body;
    const errors = [];

    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      errors.push({ field: 'name', message: 'Name must be between 2 and 100 characters' });
    }
    if (!email || !isValidEmail(String(email).trim())) {
      errors.push({ field: 'email', message: 'A valid email address is required' });
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 1000) {
      errors.push({ field: 'message', message: 'Message must be between 10 and 1000 characters' });
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', errors });
    }

    const safeName    = name.trim();
    const safeEmail   = email.trim().toLowerCase();
    const safeMessage = message.trim();

    // ── Send email via SendGrid ───────────────────────────────────────────────
    const apiKey = process.env.SENDGRID_API_KEY;
    const toEmail = process.env.CONTACT_EMAIL ?? 'MaximPim95@gmail.com';

    if (!apiKey) {
      console.error('[contact] SENDGRID_API_KEY is not set');
      // Still acknowledge receipt — the message was validated; just can't email
      return res.status(200).json({ success: true, message: 'Message received. Thank you!' });
    }

    sgMail.setApiKey(apiKey);
    const fromEmail = process.env.SENDGRID_FROM_EMAIL ?? toEmail;

    // HTML-escape all user input before interpolating into HTML (C4 fix)
    const eName    = escapeHtml(safeName);
    const eEmail   = escapeHtml(safeEmail);
    const eMessage = escapeHtml(safeMessage).replace(/\n/g, '<br>');

    await sgMail.send({
      to:      toEmail,
      from:    fromEmail,
      replyTo: safeEmail,
      subject: `Portfolio Contact: Message from ${safeName}`,
      text:    `From: ${safeName}\nEmail: ${safeEmail}\n\nMessage:\n${safeMessage}`,
      html: `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;line-height:1.6;color:#333">
        <h2 style="color:#2563eb">New Contact Form Submission</h2>
        <p><strong>From:</strong> ${eName}</p>
        <p><strong>Email:</strong> ${eEmail}</p>
        <p><strong>Message:</strong></p>
        <div style="background:#f9fafb;padding:15px;border-radius:5px;margin:10px 0">${eMessage}</div>
      </body></html>`,
      trackingSettings: { clickTracking: { enable: false }, openTracking: { enable: false } },
    });

    return res.status(200).json({ success: true, message: 'Thank you for your message. I will get back to you soon!' });

  } catch (error) {
    console.error('[contact] Unexpected error:', error?.message ?? error);
    return res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
}


// Direct CV download handler
function handleCVDownload(req, res) {
  try {
    console.log('CV download requested');
    
    const publicDir = path.join(process.cwd(), 'public');
    let cvFileName = 'Max_Mullokandov_FullStack_Developer.pdf';
    let cvPath = path.join(publicDir, cvFileName);
    
    // Check if the CV exists
    if (!fs.existsSync(cvPath)) {
      console.error('CV file not found at path:', cvPath);
      
      // Try alternate filenames
      const possibleNames = [
        'Max_Mullokandov_FullStack_Developer.pdf',
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
