import express from "express";
import { registerRoutes } from "./routes";
import { setupVite } from "./vite";
import { createServer } from "http";
import session from "express-session";
import MemoryStore from "memorystore";
import { db, connectDB } from "../db";
import { sql } from "drizzle-orm";
import * as schema from "@db/schema";

async function checkEnvironment() {
  const requiredEnvVars = [
    'PGHOST', 
    'PGPORT', 
    'PGDATABASE', 
    'PGUSER', 
    'PGPASSWORD',
    'DATABASE_URL',
    'SENDGRID_API_KEY'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => {
    const value = process.env[varName];
    return !value || value.trim() === '';
  });
  
  if (missingVars.length > 0) {
    console.error('Missing or empty required environment variables:', missingVars.join(', '));
    return false;
  }
  
  // Validate DATABASE_URL format
  try {
    const dbUrl = new URL(process.env.DATABASE_URL!);
    if (!dbUrl.protocol || !dbUrl.host || !dbUrl.pathname) {
      console.error('Invalid DATABASE_URL format');
      return false;
    }
  } catch (error) {
    console.error('Invalid DATABASE_URL:', error instanceof Error ? error.message : String(error));
    return false;
  }
  
  return true;
}

// Test database connection
async function testDbConnection() {
  try {
    console.log('Starting database connection test...');
    
    // Verify all required environment variables are set
    const dbVars = ['PGHOST', 'PGPORT', 'PGDATABASE', 'PGUSER', 'PGPASSWORD'];
    const missingVars = dbVars.filter(v => !process.env[v]);
    if (missingVars.length > 0) {
      throw new Error(`Missing required database environment variables: ${missingVars.join(', ')}`);
    }

    // Set a timeout for the entire connection test
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout after 20s')), 20000)
    );
    
    const connection = async () => {
      try {
        // Initialize database connection and run migrations
        await connectDB();
        
        // Verify database state
        const tablesResult = await db.execute(sql`
          SELECT tablename, tableowner 
          FROM pg_tables 
          WHERE schemaname = 'public'
          ORDER BY tablename;
        `);
        
        const tables = tablesResult.rows.map((r: any) => r.tablename);
        console.log('Current database tables:', tables.join(', '));
        
        // Check for required tables
        const requiredTables = ['profile', 'projects', 'skills', 'messages', 'users'];
        const missingTables = requiredTables.filter(table => !tables.includes(table));
        
        if (missingTables.length > 0) {
          console.warn(`Warning: Missing tables will be created: ${missingTables.join(', ')}`);
        }
        
        console.log('Database connection and verification completed successfully');
        return true;
      } catch (err) {
        console.error('Error during database initialization:', err instanceof Error ? err.message : String(err));
        throw err;
      }
    };

    // Race between connection attempt and timeout
    await Promise.race([connection(), timeout]);
    return true;
  } catch (error) {
    console.error('Database connection test failed:');
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Stack trace:', error.stack);
      
      // Provide specific error guidance
      if (error.message.includes('connect ECONNREFUSED')) {
        console.error(`
Could not connect to PostgreSQL server at ${process.env.PGHOST}:${process.env.PGPORT}.
Please check:
1. Database server is running
2. Port ${process.env.PGPORT} is accessible
3. No firewall is blocking the connection`);
      } else if (error.message.includes('password authentication failed')) {
        console.error(`
Database authentication failed. Please verify:
1. PGUSER environment variable matches a valid database user
2. PGPASSWORD environment variable contains the correct password
3. The user has proper permissions on the database`);
      } else if (error.message.includes('database') && error.message.includes('does not exist')) {
        console.error(`
Database "${process.env.PGDATABASE}" does not exist.
The database will be created during the connection process.`);
      }
    } else {
      console.error('Unknown error:', String(error));
    }
    return false;
  }
}

const app = express();
// Trust proxy for proper rate limiting behind Replit's proxy
app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public')); // Serve static files from public directory

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
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    }
  })
);

// CORS configuration
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3001', 'http://localhost:5000'];
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Register API routes before Vite middleware
registerRoutes(app);

// Create HTTP server
const server = createServer(app);

// Setup Vite in development mode
if (process.env.NODE_ENV !== "production") {
  setupVite(app, server);
}

const PORT = process.env.PORT || process.env.NODE_ENV === "production" ? 3000 : 5000;

// Start server after checking environment and database connection
async function startServer() {
  try {
    const envCheck = await checkEnvironment();
    if (!envCheck) {
      console.error('Missing required environment variables. Server will not start.');
      process.exit(1);
    }

    const dbConnected = await testDbConnection();
    if (!dbConnected) {
      console.error('Failed to connect to database. Server will not start.');
      process.exit(1);
    }

    return new Promise((resolve, reject) => {
      const startServer = () => {
        try {
          server.listen(Number(PORT), "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`API available at http://localhost:${PORT}/api`);
            console.log('Development server started successfully');
            resolve(true);
          });

          server.on('error', (error: NodeJS.ErrnoException) => {
            if (error.code === 'EADDRINUSE') {
              console.log(`Port ${PORT} is busy, retrying...`);
              server.close();
              setTimeout(startServer, 1000);
            } else {
              console.error('Server error:', error);
              reject(error);
            }
          });
        } catch (err) {
          console.error('Failed to start server:', err);
          reject(err);
        }
      };

      startServer();
    });
  } catch (error) {
    console.error('Failed to start server:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// Handle server errors
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      console.error(`Port ${PORT} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`Port ${PORT} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});