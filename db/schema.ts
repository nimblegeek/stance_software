import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
});

export const clubs = pgTable("clubs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
});

export const sessions = pgTable("sessions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clubId: integer("club_id").references(() => clubs.id),
  date: timestamp("date").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  maxCapacity: integer("max_capacity").notNull(),
  currentCapacity: integer("current_capacity").notNull(),
  price: integer("price").notNull(),
  isOpen: boolean("is_open").notNull().default(true),
});

export const insertClubSchema = createInsertSchema(clubs);
export const selectClubSchema = createSelectSchema(clubs);
export type InsertClub = z.infer<typeof insertClubSchema>;
export type Club = z.infer<typeof selectClubSchema>;

export const insertSessionSchema = createInsertSchema(sessions);
export const selectSessionSchema = createSelectSchema(sessions);
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = z.infer<typeof selectSessionSchema>;

// User schemas with password validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  hashedPassword: z.string().min(6),
  name: z.string().min(2),
});

export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;

// Login schema (for validation only, not DB)
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
