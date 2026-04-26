import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  unionId: text("unionId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  avatar: text("avatar"),
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .defaultNow()
    .notNull(),
  lastSignInAt: integer("lastSignInAt", { mode: "timestamp" }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const commissions = sqliteTable("commissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  projectType: text("projectType", {
    enum: ["editorial", "brand", "publishing", "packaging", "motion", "other"],
  }).notNull(),
  description: text("description"),
  deliverables: text("deliverables", { mode: "json" }).$type<string[]>(),
  deadline: text("deadline"),
  budget: text("budget", {
    enum: [
      "under5k",
      "5to10k",
      "10to25k",
      "25to50k",
      "over50k",
      "undisclosed",
    ],
  }).default("undisclosed"),
  rightsUsage: text("rightsUsage", {
    enum: [
      "oneTime",
      "limited",
      "exclusive",
      "fullBuyout",
      "toBeDiscussed",
    ],
  }).default("toBeDiscussed"),
  visualReferences: text("visualReferences", { mode: "json" }).$type<string[]>(),
  status: text("status", {
    enum: [
      "draft",
      "submitted",
      "inReview",
      "approved",
      "inProgress",
      "revision",
      "completed",
      "cancelled",
    ],
  }).default("draft"),
  notes: text("notes"),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .defaultNow()
    .notNull(),
});

export type Commission = typeof commissions.$inferSelect;
export type InsertCommission = typeof commissions.$inferInsert;

export const commissionEvents = sqliteTable("commissionEvents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  commissionId: integer("commissionId")
    .notNull()
    .references(() => commissions.id),
  type: text("type", {
    enum: ["statusChange", "note", "message", "file", "milestone"],
  }).notNull(),
  content: text("content").notNull(),
  createdBy: integer("createdBy").references(() => users.id),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow().notNull(),
});

export type CommissionEvent = typeof commissionEvents.$inferSelect;

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  commissionId: integer("commissionId").references(() => commissions.id),
  userId: integer("userId")
    .notNull()
    .references(() => users.id),
  content: text("content").notNull(),
  isStaffReply: integer("isStaffReply", { mode: "boolean" }).default(false),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;

