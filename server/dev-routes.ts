import type { Express, Request, Response } from "express";
import session from "express-session";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";
import xss from "xss";
import { devDb } from "../db/dev-setup";
import sgMail from '@sendgrid/mail';

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

// Create a limiter for contact form submissions
const contactLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes window (reduced from 15 for testing)
  max: 10, // limit each IP to 10 requests per window (increased from 3 for testing)
  message: {
    error: "Rate limit exceeded",
    message: "To prevent spam, please wait 5 minutes before sending another message. Your previous messages have been received."
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Access the SQLite database directly
const db = (devDb as any).$client;

// We'll initialize SendGrid later when we're sure env vars are loaded
let isValidApiKey = false;

// Function to actually send email via SendGrid
async function sendEmail(name: string, email: string, message: string): Promise<{success: boolean, error: string}> {
  // Check if API key is valid
  if (!isValidApiKey) {
    console.log('SendGrid API key format invalid - not attempting to send');
    return { success: false, error: 'SendGrid API key not configured correctly' };
  }
  
  try {
    // Extra validation for the API key environment variable
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.error('SendGrid API key is missing when trying to send');
      return { success: false, error: 'SendGrid API key is missing' };
    }

    console.log('Attempting to send email via SendGrid...');
    const msg = {
      to: 'maximpim95@gmail.com',
      from: 'maximpim95@gmail.com', // Make sure this is verified in SendGrid
      subject: 'New Contact Form Message',
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<strong>Name:</strong> ${name}<br>
             <strong>Email:</strong> ${email}<br>
             <strong>Message:</strong> ${message}`,
    };
    console.log('Email details:', {
      to: msg.to,
      from: msg.from,
      subject: msg.subject,
      replyTo: msg.replyTo
    });

    // Set API key explicitly before each send
    sgMail.setApiKey(apiKey);
    
    // Send the email and capture the response for better debugging
    const [response] = await sgMail.send(msg);
    
    // Log complete SendGrid response for debugging
    console.log('SendGrid API Response:', {
      statusCode: response?.statusCode,
      headers: response?.headers,
      body: response?.body
    });
    
    if (response && response.statusCode >= 200 && response.statusCode < 300) {
      console.log('Email sent successfully via SendGrid!');
      return { success: true, error: '' };
    } else {
      console.error('SendGrid returned non-success status code:', response?.statusCode);
      return { success: false, error: `SendGrid returned status code: ${response?.statusCode}` };
    }
  } catch (error: any) {
    console.error('SendGrid error details:', error);
    
    // Check for common SendGrid errors
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection to SendGrid refused');
    }
    
    // More detailed error logging
    if (error && typeof error === 'object') {
      if ('response' in error) {
        const response = (error as any).response;
        if (response && response.body) {
          console.error('SendGrid API error response:', JSON.stringify(response.body, null, 2));
        }
      }
      
      if ('message' in error) {
        console.error('Error message:', (error as any).message);
      }
      
      // Check for specific SendGrid error types
      if ('code' in error) {
        console.error('Error code:', (error as any).code);
      }
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error sending email'
    };
  }
}

// Initialize SendGrid with environment variables
function initializeSendGrid() {
  // Initialize SendGrid if API key is available
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

  // Mask API key for safe logging (show only first 10 chars)
  const maskedKey = SENDGRID_API_KEY 
    ? `${SENDGRID_API_KEY.substring(0, 10)}...${SENDGRID_API_KEY.length - 10} chars total` 
    : 'none';

  // More detailed debug logging for API key
  console.log('\n------------- SENDGRID DEBUG -------------');
  console.log('- Key exists?', !!SENDGRID_API_KEY);
  console.log('- Key length:', SENDGRID_API_KEY ? SENDGRID_API_KEY.length : 0);
  console.log('- Key format check (starts with SG.)?', SENDGRID_API_KEY ? SENDGRID_API_KEY.startsWith('SG.') : false);
  console.log('- Key mask:', maskedKey);
  
  // Test an API validate call (doesn't actually send mail)
  try {
    console.log('- Testing SendGrid connection...');
    if (SENDGRID_API_KEY) {
      sgMail.setApiKey(SENDGRID_API_KEY);
      console.log('- API key set successfully');
    } else {
      console.log('- Could not set API key - undefined');
    }
  } catch (error) {
    console.error('- Error setting API key:', error);
  }
  
  console.log('------------------------------------------\n');

  // SIMPLIFIED VALIDATION - only check if key exists and starts with SG.
  isValidApiKey = Boolean(SENDGRID_API_KEY && SENDGRID_API_KEY.startsWith('SG.'));

  if (isValidApiKey) {
    if (SENDGRID_API_KEY) {
      sgMail.setApiKey(SENDGRID_API_KEY);
    }
    console.log('SUCCESS: SendGrid API initialized for email sending');
    return true;
  } else {
    console.log('WARNING: SendGrid API key not properly configured. Emails will be logged but not sent.');
    return false;
  }
}

export function registerDevRoutes(app: Express) {
  // Initialize SendGrid here, when we're sure env vars are loaded
  initializeSendGrid();
  
  // Projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = db.prepare('SELECT * FROM projects').all();
      res.json(projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const { title, description, technologies, github_url, image_url, live_url } = req.body;
      
      // Insert directly with SQLite
      const stmt = db.prepare(`
        INSERT INTO projects (title, description, technologies, github_url, image_url, live_url) 
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      const info = stmt.run(
        title, 
        description, 
        JSON.stringify(technologies), 
        github_url,
        image_url || null,
        live_url || null
      );
      
      const id = info.lastInsertRowid;
      const newProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
      
      res.json(newProject);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  // Skills
  app.get("/api/skills", async (req, res) => {
    try {
      const skills = db.prepare('SELECT * FROM skills').all();
      res.json(skills || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  });

  app.post("/api/skills", async (req, res) => {
    try {
      const { name, category, icon } = req.body;
      
      // Insert directly with SQLite
      const stmt = db.prepare(`
        INSERT INTO skills (name, category, icon) 
        VALUES (?, ?, ?)
      `);
      
      const info = stmt.run(name, category, icon || null);
      const id = info.lastInsertRowid;
      const newSkill = db.prepare('SELECT * FROM skills WHERE id = ?').get(id);
      
      res.json(newSkill);
    } catch (error) {
      console.error("Error creating skill:", error);
      res.status(500).json({ error: "Failed to create skill" });
    }
  });

  // Profile
  app.get("/api/profile", async (req, res) => {
    try {
      // Query SQLite directly
      const profileData = db.prepare('SELECT * FROM profile LIMIT 1').get();
      res.json(profileData || {});
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.put("/api/profile", async (req, res) => {
    try {
      const { id, name, title, bio, social_links, resume_url, profile_image } = req.body;
      
      // Update directly with SQLite
      const stmt = db.prepare(`
        UPDATE profile 
        SET name = ?, title = ?, bio = ?, social_links = ?, resume_url = ?, profile_image = ?
        WHERE id = ?
      `);
      
      stmt.run(
        name, 
        title, 
        bio, 
        typeof social_links === 'object' ? JSON.stringify(social_links) : social_links,
        resume_url,
        profile_image,
        id
      );
      
      const updatedProfile = db.prepare('SELECT * FROM profile WHERE id = ?').get(id);
      res.json(updatedProfile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Contact Form with rate limiting and validation
  app.post("/api/contact", 
    contactLimiter,
    [
      body('name').trim().escape().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
      body('email').trim().isEmail().normalizeEmail().withMessage('Must provide a valid email'),
      body('message').trim().escape().isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters')
    ],
    async (req: Request, res: Response) => {
      try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        // Sanitize inputs
        const sanitizedData = {
          name: xss(req.body.name),
          email: xss(req.body.email),
          message: xss(req.body.message)
        };

        // Validate request body
        if (!sanitizedData.name || !sanitizedData.email || !sanitizedData.message) {
          return res.status(400).json({ error: 'All fields are required: name, email, and message' });
        }

        // Store message in SQLite database
        const stmt = db.prepare(`
          INSERT INTO messages (name, email, message)
          VALUES (?, ?, ?)
        `);
        
        const info = stmt.run(sanitizedData.name, sanitizedData.email, sanitizedData.message);
        const id = info.lastInsertRowid;
        
        const savedMessage = db.prepare('SELECT * FROM messages WHERE id = ?').get(id);
        
        console.log('Message saved to database:', id);

        // Always log the email in development mode
        console.log('Development Mode: Email would be sent with the following content:');
        console.log('To: MaximPim95@gmail.com');
        console.log('From: Portfolio Website <MaximPim95@gmail.com>');
        console.log('Reply-To:', sanitizedData.email);
        console.log('Subject: New Contact Form Message');
        console.log('Message:', sanitizedData.message);
        
        // Actually attempt to send the email if SendGrid is configured
        let emailResult = { success: false, error: 'Email sending not attempted' };
        if (isValidApiKey) {
          console.log('SendGrid configuration check passed, attempting to send email');
          emailResult = await sendEmail(
            sanitizedData.name, 
            sanitizedData.email, 
            sanitizedData.message
          );
          
          if (emailResult.success) {
            console.log('Email successfully sent via SendGrid!');
          } else {
            console.error('Failed to send email via SendGrid:', emailResult.error);
            // Ensure error is always a string
            emailResult = {
              ...emailResult,
              error: emailResult.error || 'Unknown email error'
            };
          }
        } else {
          const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
          console.log('DEBUG - SendGrid configuration check failed:');
          console.log('- API key valid?', isValidApiKey);
          console.log('- API key exists?', !!SENDGRID_API_KEY);
          console.log('- API key starts with SG.?', SENDGRID_API_KEY ? SENDGRID_API_KEY.startsWith('SG.') : false);
        }

        // Return success response
        return res.json({
          success: true,
          message: savedMessage,
          emailSent: emailResult.success,
          emailError: emailResult.error,
          devMode: true,
          details: {
            to: 'MaximPim95@gmail.com',
            timestamp: new Date().toISOString()
          }
        });
      } catch (error) {
        console.error('Unexpected error in contact form:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return res.status(500).json({ error: errorMessage }); 
      }
    }
  );

  // User login/authentication routes would go here
  // We're omitting them for this development setup

  // Catch-all route for API
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
  });
} 