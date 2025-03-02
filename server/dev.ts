// Load environment variables from .env file at the very beginning
import dotenv from "dotenv";
dotenv.config();
console.log("Environment variables loaded from .env file");
console.log("SendGrid API Key exists:", !!process.env.SENDGRID_API_KEY);
console.log("SendGrid API Key length:", process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY.length : 0);

import express from "express";
import { createServer } from "http";
import session from "express-session";
import MemoryStore from "memorystore";
import { setupDevDb, devDb } from "../db/dev-setup";
import path from "path";

// Explicitly avoid using the PostgreSQL database
// Mock the db import for routes
(global as any).db = devDb;

// We need to import routes after setting the global.db
import { registerDevRoutes } from "./dev-routes";
import { setupVite } from "./vite";

// Add these lines to prevent any other routes from being loaded
// Block any accidental import of the regular routes
(global as any).blockRegularRoutes = true;

const app = express();
// Trust proxy for development
app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from multiple directories
app.use(express.static('public')); // Serve files from public directory
app.use(express.static(path.join(process.cwd()))); // Serve files from root directory for images like EAC167A1-6630-4BA0-BFE2-9B0146599AF3.png

// Create a special route for serving the CV
app.get('/Max Mullokandov CV.pdf', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'Max Mullokandov CV.pdf'));
});

// Create a route to serve the profile image directly
app.get('/profile-image', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'EAC167A1-6630-4BA0-BFE2-9B0146599AF3.png'));
});

// Add a route for testing the contact form
app.get('/test-contact', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'test-contact.html'));
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const MemoryStoreSession = MemoryStore(session);
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStoreSession({
      checkPeriod: 86400000
    }),
    cookie: {
      secure: false, // Set to false for development
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    }
  })
);

// CORS configuration for development
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Register ONLY our development API routes
registerDevRoutes(app);

// Create HTTP server
const server = createServer(app);

// Setup Vite in development mode
setupVite(app, server);

const PORT = process.env.PORT || 5000;

// Start server after setting up development database
async function startDevServer() {
  try {
    console.log("Setting up development environment...");
    
    // Initialize SQLite database
    await setupDevDb();
    
    server.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`Development server running on port ${PORT}`);
      console.log(`Frontend available at http://localhost:${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
      console.log(`Profile image available at http://localhost:${PORT}/profile-image`);
      console.log(`CV available at http://localhost:${PORT}/Max%20Mullokandov%20CV.pdf`);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please try a different port.`);
      } else {
        console.error('Server error:', error);
      }
    });
  } catch (error) {
    console.error('Failed to start development server:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

startDevServer().catch((error) => {
  console.error('Failed to start development server:', error);
  process.exit(1);
}); 