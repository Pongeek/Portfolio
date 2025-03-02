import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../db/db';
import { projects } from '../../db/schema';
import { SendGrid } from '../sendgrid';

// This is the main API handler for Vercel serverless environment
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Initialize SendGrid
  const sendGrid = new SendGrid(process.env.SENDGRID_API_KEY || '');

  // Handle different routes based on path
  const path = req.query.path || '';
  
  // GET /api/projects - Return all projects
  if (req.method === 'GET' && path === 'projects') {
    try {
      const allProjects = await db.select().from(projects);
      return res.status(200).json(allProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      return res.status(500).json({ error: 'Failed to fetch projects' });
    }
  }
  
  // POST /api/contact - Handle contact form submissions
  if (req.method === 'POST' && path === 'contact') {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    
    try {
      await sendGrid.sendEmail({
        to: process.env.CONTACT_EMAIL || 'your-email@example.com',
        from: process.env.SENDGRID_FROM_EMAIL || 'no-reply@your-domain.com',
        subject: `Portfolio Contact Form: ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `<p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong> ${message}</p>`
      });
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Failed to send message' });
    }
  }
  
  // If no route matches
  return res.status(404).json({ error: 'API endpoint not found' });
} 