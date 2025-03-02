import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a better-sqlite3 database instance
let dbPath = path.join(__dirname, '..', 'dev.db');

// For Vercel environment, use an in-memory database
if (process.env.VERCEL) {
  dbPath = ':memory:';
}

// Initialize the SQLite database
const sqlite = new Database(dbPath);

// Create a drizzle instance using the SQLite database
export const db = drizzle(sqlite); 