import { pgTable, text, integer, timestamp, pgEnum, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);
export const statusEnum = pgEnum("status", [
  "open",
  "in_review",
  "approved",
  "rejected",
  "in_progress",
  "completed",
]);

export const featureRequests = pgTable("feature_requests", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: priorityEnum("priority").notNull(),
  status: statusEnum("status").default("open").notNull(),
  submitterId: integer("submitter_id")
    .references(() => users.id)
    .notNull(),
  contactInfo: text("contact_info"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;

export const insertFeatureRequestSchema = createInsertSchema(featureRequests);
export const selectFeatureRequestSchema = createSelectSchema(featureRequests);
export type InsertFeatureRequest = z.infer<typeof insertFeatureRequestSchema>;
export type FeatureRequest = z.infer<typeof selectFeatureRequestSchema>;
