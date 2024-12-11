import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Projects table
export const projects = pgTable("projects", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  technologies: text("technologies").array(),
  imageUrl: varchar("image_url", { length: 255 }),
  liveUrl: varchar("live_url", { length: 255 }),
  githubUrl: varchar("github_url", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Skills table
export const skills = pgTable("skills", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 255 }),
});

// Messages table
export const messages = pgTable("messages", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Profile table
export const profile = pgTable("profile", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  bio: text("bio").notNull(),
  socialLinks: text("social_links"),
  resumeUrl: varchar("resume_url", { length: 255 }).notNull(),
});

// Zod Schemas for input validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertProjectSchema = createInsertSchema(projects);
export const selectProjectSchema = createSelectSchema(projects);
export const insertSkillSchema = createInsertSchema(skills);
export const selectSkillSchema = createSelectSchema(skills);
export const insertMessageSchema = createInsertSchema(messages);
export const selectMessageSchema = createSelectSchema(messages);
export const insertProfileSchema = createInsertSchema(profile);
export const selectProfileSchema = createSelectSchema(profile);

// Types
export type User = z.infer<typeof selectUserSchema>;
export type Project = z.infer<typeof selectProjectSchema>;
export type Skill = z.infer<typeof selectSkillSchema>;
export type Message = z.infer<typeof selectMessageSchema>;
export type Profile = z.infer<typeof selectProfileSchema>;
