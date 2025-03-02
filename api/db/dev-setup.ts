import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create a SQLite database for development
const sqlite = new Database("data/portfolio.db");

// Create Drizzle ORM instance and expose the raw connection
export const devDb = drizzle(sqlite);
// Expose the raw connection for direct queries
(devDb as any).$client = sqlite;

// Initialize SQLite database
export function setupDevDb() {
  try {
    console.log('Setting up SQLite database for development...');
    
    // Manually create tables - don't use migrations since they're written for PostgreSQL
    console.log('Creating tables manually...');
    
    // Drop tables if they exist to avoid conflicts
    sqlite.exec(`
      DROP TABLE IF EXISTS messages;
      DROP TABLE IF EXISTS projects;
      DROP TABLE IF EXISTS skills;
      DROP TABLE IF EXISTS profile;
      DROP TABLE IF EXISTS users;
    `);
    
    // Create tables with SQLite syntax
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS profile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        title TEXT NOT NULL,
        bio TEXT NOT NULL,
        social_links TEXT,
        resume_url TEXT NOT NULL,
        profile_image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        technologies TEXT,
        image_url TEXT,
        live_url TEXT,
        github_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        icon TEXT
      );
      
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Load projects from JSON file
    const projectsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'projects.json'), 'utf8'));
    
    // Insert projects from the JSON file
    if (projectsData && projectsData.projects && projectsData.projects.length > 0) {
      // Drop existing projects first
      sqlite.exec(`DROP TABLE IF EXISTS projects`);
      
      // Create projects table
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS projects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          technologies TEXT,
          image_url TEXT,
          live_url TEXT,
          github_url TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      // Prepare insert statement
      const insertProject = sqlite.prepare(`
        INSERT INTO projects (title, description, technologies, image_url, live_url, github_url, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      // Insert each project
      for (const project of projectsData.projects) {
        insertProject.run(
          project.title,
          project.description,
          JSON.stringify(project.technologies),
          project.imageUrl,
          project.liveUrl || '',
          project.githubUrl || '',
          project.createdAt || new Date().toISOString()
        );
      }
      
      console.log(`Loaded ${projectsData.projects.length} projects from projects.json`);
    }
    
    // Add sample data
    const profileExists = sqlite.prepare("SELECT COUNT(*) as count FROM profile").get() as { count: number };
    if (profileExists.count === 0) {
      console.log('Adding your profile data...');
      sqlite.prepare(`
        INSERT INTO profile (name, title, bio, social_links, resume_url, profile_image)
        VALUES (
          'Max Mullokandov', 
          'Full-Stack Developer', 
          'A passionate developer with experience in modern web technologies including React.js, Express, and TypeScript. I build responsive and powerful web applications with clean, maintainable code.',
          '{"github":"https://github.com/yourusername","linkedin":"https://linkedin.com/in/yourusername"}',
          '/Max Mullokandov CV.pdf',
          '/EAC167A1-6630-4BA0-BFE2-9B0146599AF3.png'
        )
      `).run();
      
      // We're already loading projects from projects.json, so we don't need these hardcoded inserts
      /*
      console.log('Adding your project data...');
      sqlite.prepare(`
        INSERT INTO projects (title, description, technologies, image_url, github_url, live_url)
        VALUES (
          'Portfolio Website', 
          'A responsive personal portfolio website built with React, Express, and TypeScript. Features include a contact form, project showcase, and animated UI components.',
          '["React", "TypeScript", "Express", "PostgreSQL", "Tailwind CSS", "Shadcn UI"]', 
          '/EAC167A1-6630-4BA0-BFE2-9B0146599AF3.png',
          'https://github.com/yourusername/portfolio',
          'https://portfolio-demo.com'
        )
      `).run();

      sqlite.prepare(`
        INSERT INTO projects (title, description, technologies, image_url, github_url, live_url)
        VALUES (
          'CoupCoupon Project', 
          'This project is a full-stack web application that integrates a React TypeScript frontend with a Java Spring backend and uses MySQL for data storage. The application is designed to provide a seamless user experience with efficient data management and robust backend support.',
          '["Java Spring", "React", "MySQL", "TypeScript", "JWT", "RestAPI"]', 
          '/coupcoupon-landing.png',
          'https://github.com/yourusername/coupcoupon',
          'https://coupcoupon.repl.co'
        )
      `).run();
      */
      
      console.log('Adding your skills data...');
      // Frontend skills
      sqlite.prepare(`
        INSERT INTO skills (name, category, icon)
        VALUES ('React', 'Frontend', 'react-icon')
      `).run();
      sqlite.prepare(`
        INSERT INTO skills (name, category, icon)
        VALUES ('TypeScript', 'Frontend', 'typescript-icon')
      `).run();
      sqlite.prepare(`
        INSERT INTO skills (name, category, icon)
        VALUES ('JavaScript', 'Frontend', 'javascript-icon')
      `).run();
      sqlite.prepare(`
        INSERT INTO skills (name, category, icon)
        VALUES ('Tailwind CSS', 'Frontend', 'tailwind-icon')
      `).run();
      
      // Backend skills
      sqlite.prepare(`
        INSERT INTO skills (name, category, icon)
        VALUES ('Node.js', 'Backend', 'nodejs-icon')
      `).run();
      sqlite.prepare(`
        INSERT INTO skills (name, category, icon)
        VALUES ('Express', 'Backend', 'express-icon')
      `).run();
      sqlite.prepare(`
        INSERT INTO skills (name, category, icon)
        VALUES ('PostgreSQL', 'Backend', 'postgresql-icon')
      `).run();
      sqlite.prepare(`
        INSERT INTO skills (name, category, icon)
        VALUES ('REST API', 'Backend', 'api-icon')
      `).run();
      
      // DevOps skills
      sqlite.prepare(`
        INSERT INTO skills (name, category, icon)
        VALUES ('Git', 'DevOps', 'git-icon')
      `).run();
      sqlite.prepare(`
        INSERT INTO skills (name, category, icon)
        VALUES ('Docker', 'DevOps', 'docker-icon')
      `).run();
    }
    
    console.log('Development database setup complete');
    return true;
  } catch (err) {
    console.error('Error setting up development database:', err);
    throw err;
  }
}

// Handle cleanup
process.on('SIGINT', () => {
  sqlite.close();
  process.exit(0);
}); 