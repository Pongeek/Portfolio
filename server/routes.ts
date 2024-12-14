import type { Express, Request, Response } from "express";
import session from "express-session";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";
import xss from "xss";

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}
import { db } from "../db";
import { messages, profile, projects, skills, users } from "@db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Create a limiter for contact form submissions
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 3, // limit each IP to 3 requests per window
  message: {
    error: "Rate limit exceeded",
    message: "To prevent spam, please wait 15 minutes before sending another message. Your previous messages have been received."
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


export function registerRoutes(app: Express) {
  // Projects
  app.get("/api/projects", async (req, res) => {
    const allProjects = await db.select().from(projects).orderBy(projects.createdAt);
    res.json(allProjects);
  });

  app.post("/api/projects", async (req, res) => {
    const project = await db.insert(projects).values(req.body).returning();
    res.json(project[0]);
  });

  // Skills
  app.get("/api/skills", async (req, res) => {
    const allSkills = await db.select().from(skills);
    res.json(allSkills);
  });

  app.post("/api/skills", async (req, res) => {
    const skill = await db.insert(skills).values(req.body).returning();
    res.json(skill[0]);
  });

  // Profile
  app.get("/api/profile", async (req, res) => {
    const profileData = await db.select().from(profile).limit(1);
    res.json(profileData[0]);
  });

  app.put("/api/profile", async (req, res) => {
    const { id, ...updateData } = req.body;
    const updatedProfile = await db
      .update(profile)
      .set(updateData)
      .where(eq(profile.id, id))
      .returning();
    res.json(updatedProfile[0]);
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

        console.log('Received contact form submission:', { 
          name: sanitizedData.name,
          email: sanitizedData.email,
          messageLength: sanitizedData.message?.length 
        });

      // Validate request body
      if (!req.body.name || !req.body.email || !req.body.message) {
        console.error('Missing required fields in contact form');
        return res.status(400).json({ error: 'All fields are required: name, email, and message' });
      }

      // Store message in database first
      let savedMessage;
      try {
        const result = await db.insert(messages).values(sanitizedData).returning();
        savedMessage = result[0];
        console.log('Message saved to database:', savedMessage.id);
      } catch (dbError) {
        console.error('Database error:', dbError);
        return res.status(500).json({ error: 'Failed to save message to database' });
      }

      // Initialize SendGrid
        try {
          const { default: sgMail } = await import('@sendgrid/mail');
          const apiKey = process.env.SENDGRID_API_KEY;
          
          if (!apiKey) {
            console.error('SendGrid API key is missing');
            throw new Error('Email service configuration error');
          }
          
          console.log('Configuring SendGrid with API key');
          sgMail.setApiKey(apiKey);

          const senderEmail = 'MaximPim95@gmail.com';
          const replyToEmail = sanitizedData.email;
          
          // Prepare email content with proper sender format and security headers
          const emailContent = {
            to: senderEmail,
            from: {
              email: senderEmail,
              name: 'Portfolio Website'
            },
            replyTo: replyToEmail,
            subject: 'New Contact Form Message',
            text: `New message from your portfolio website:

From: ${sanitizedData.name}
Email: ${sanitizedData.email}
Message:
${sanitizedData.message}
            `.trim(),
            html: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h2 style="color: #2563eb;">New Contact Form Submission</h2>
  <p><strong>From:</strong> ${sanitizedData.name}</p>
  <p><strong>Email:</strong> ${sanitizedData.email}</p>
  <p><strong>Message:</strong></p>
  <div style="background: #f9fafb; padding: 15px; border-radius: 5px; margin: 10px 0;">
    ${sanitizedData.message}
  </div>
</body>
</html>
            `.trim(),
            trackingSettings: {
              clickTracking: { enable: false },
              openTracking: { enable: false }
            },
            // Remove sandbox mode to ensure actual delivery
            mailSettings: {
              sandboxMode: {
                enable: false
              }
            }
          };

          // Send email with detailed error handling and logging
          try {
            console.log('Attempting to send email via SendGrid...');
            console.log('Email content:', {
              to: senderEmail,
              from: emailContent.from.email,
              subject: emailContent.subject,
              hasText: !!emailContent.text,
              hasHtml: !!emailContent.html
            });
            
            const [response] = await sgMail.send(emailContent);
            console.log('SendGrid API Response:', {
              to: senderEmail,
              statusCode: response?.statusCode,
              headers: response?.headers,
              messageId: response?.headers['x-message-id'],
              timestamp: new Date().toISOString()
            });

            // Verify the response is actually successful
            if (response?.statusCode !== 202) {
              throw new Error(`Unexpected status code: ${response?.statusCode}`);
            }
        
            // Return success response
            return res.json({
              success: true,
              message: savedMessage,
              emailSent: true,
              details: {
                to: senderEmail,
                timestamp: new Date().toISOString()
              }
            });
          } catch (sendGridError: any) {
            console.error('SendGrid send error:', {
              error: sendGridError?.message || String(sendGridError),
              response: sendGridError?.response?.body,
              code: sendGridError?.code,
              statusCode: sendGridError?.response?.statusCode,
              timestamp: new Date().toISOString()
            });

            // Check for specific SendGrid errors and provide detailed feedback
            const errorDetails = sendGridError?.response?.body;
            const specificError = errorDetails?.errors?.[0]?.message;
            const errorMessage = specificError
              ? `Email sending failed: ${specificError}`
              : 'Unable to send email. Please try again later.';

            return res.status(500).json({
              success: false,
              message: savedMessage,
              emailSent: false,
              error: errorMessage,
              details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
            });
          }
        } catch (emailError: any) {
          console.error('Email service error:', {
            error: emailError?.message || String(emailError),
            code: emailError?.code,
            stack: process.env.NODE_ENV === 'development' ? emailError?.stack : undefined
          });
        
          // Return user-friendly error response
          return res.status(500).json({
            success: false,
            message: savedMessage,
            emailSent: false,
            error: 'We were unable to send your message via email, but it has been saved. We will get back to you soon.'
          });
        }
      } catch (error: unknown) {
        console.error('Unexpected error in contact form:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return res.status(500).json({ 
          error: 'Failed to process contact form submission',
          details: errorMessage 
        });
      }
    });

  // Auth
  app.post("/api/auth/login", async (req, res) => {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, req.body.username))
      .limit(1);

    if (!user[0] || !bcrypt.compareSync(req.body.password, user[0].password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.userId = user[0].id;
    res.json({ success: true });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });
}