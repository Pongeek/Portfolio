import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  strict: true,
  verbose: true,
  dbCredentials: {
    host: process.env.PGHOST!,
    port: parseInt(process.env.PGPORT || '5432'),
    database: process.env.PGDATABASE!,
    user: process.env.PGUSER!,
    password: process.env.PGPASSWORD!,
    ssl: {
      rejectUnauthorized: false
    }
  }
});
