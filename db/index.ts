import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { sql } from "drizzle-orm";
import pg from "pg";
const { Pool } = pg;

// Create PostgreSQL connection pool with better error handling
const pool = new Pool({
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || '5432'),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  max: 3, // Minimal connections for Replit environment
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  statement_timeout: 10000,
  application_name: 'portfolio-app',
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

// Add error handling for the pool
pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err.message);
  if (err.stack) console.error(err.stack);
});

// Create Drizzle ORM instance with logging
export const db = drizzle(pool);

// Initialize database connection
export const connectDB = async () => {
  try {
    console.log('Attempting to connect to PostgreSQL...');
    
    // Test initial connection with retry logic
    let client;
    let connected = false;
    const maxRetries = 5;
    const retryDelay = 1000; // 1 second

    for (let i = 0; i < maxRetries && !connected; i++) {
      try {
        console.log(`Connection attempt ${i + 1} of ${maxRetries}...`);
        client = await pool.connect();
        await client.query('SELECT NOW()');
        connected = true;
        console.log('Successfully connected to PostgreSQL');
      } catch (err) {
        console.error(`Connection attempt ${i + 1} failed:`, err instanceof Error ? err.message : String(err));
        if (i === maxRetries - 1) {
          console.error('All connection attempts failed');
          throw err;
        }
        await new Promise(resolve => setTimeout(resolve, retryDelay * (i + 1))); // Exponential backoff
      } finally {
        if (client) {
          client.release();
        }
      }
    }

    // Ensure migrations directory exists
    const fs = await import('fs/promises');
    const path = await import('path');
    const migrationsDir = path.join(process.cwd(), 'drizzle');
    
    try {
      await fs.access(migrationsDir);
      console.log('Migrations directory exists:', migrationsDir);
    } catch {
      await fs.mkdir(migrationsDir, { recursive: true });
      console.log('Created migrations directory:', migrationsDir);
    }

    // Run migrations with proper error handling
    try {
      console.log('Starting database migrations...');
      
      // Verify if database is empty before running migrations
      // Check if database is empty using type-safe query
      const tableCheck = await db.execute(sql`
        SELECT COUNT(*)::integer as table_count
        FROM information_schema.tables 
        WHERE table_schema = 'public';
      `);
      
      const tableCount = tableCheck.rows[0]?.table_count ?? 0;
      if (tableCount === 0) {
        console.log('Database is empty, running initial migration...');
      }

      await migrate(db, { migrationsFolder: migrationsDir });
      console.log('Database migrations completed successfully');

      // Verify all required tables exist
      const tables = await db.execute(sql`
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY tablename;
      `);
      
      const tableNames = tables.rows.map((r: any) => r.tablename);
      console.log('Available tables after migration:', tableNames.join(', '));

      // Check for all required tables
      const requiredTables = ['profile', 'projects', 'skills', 'messages', 'users'];
      const missingTables = requiredTables.filter(table => !tableNames.includes(table));
      
      if (missingTables.length > 0) {
        console.warn('Warning: Missing required tables:', missingTables.join(', '));
        console.log('Running migrations to create missing tables...');
        await migrate(db, { migrationsFolder: migrationsDir });
      }
      
    } catch (err) {
      if (err instanceof Error && err.message.includes('no migrations found')) {
        console.log('No new migrations to apply');
      } else {
        console.error('Migration error:', err instanceof Error ? err.message : String(err));
        throw err;
      }
    }

    return true;
  } catch (err) {
    console.error('Database connection/setup error:', err instanceof Error ? err.message : String(err));
    if (err instanceof Error && err.stack) {
      console.error('Stack trace:', err.stack);
    }
    throw err;
  }
};

// Handle cleanup
process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});
