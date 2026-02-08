import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * ENUMS
 * Defines the allowed statuses for a match, ensuring data integrity.
 */
export const matchStatusEnum = pgEnum("match_status", [
  "scheduled",
  "live",
  "finished",
]);

/**
 * TABLE: Matches
 * Represents a single sports match, tracking teams, scores, and status.
 * Drizzle automatically maps camelCase variable names to snake_case column names.
 * e.g., 'homeTeam' becomes 'home_team' in the database.
 */
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  sport: text("sport").notNull(),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  status: matchStatusEnum("status").default("scheduled").notNull(),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }),
  homeScore: integer("home_score").default(0).notNull(),
  awayScore: integer("away_score").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/**
 * TABLE: Commentary
 * Stores real-time commentary, events, and notes for a specific match.
 * This table is designed to capture a granular stream of events.
 */
export const commentary = pgTable("commentary", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id")
    .notNull()
    .references(() => matches.id, { onDelete: "cascade" }),
  minute: integer("minute"),
  sequence: integer("sequence").notNull(), // To order events within the same minute
  period: text("period"), // e.g., '1st Half', '2nd Half', 'OT'
  eventType: text("event_type"), // e.g., 'goal', 'card', 'substitution'
  actor: text("actor"), // e.g., Player name
  team: text("team"), // The team associated with the event
  message: text("message").notNull(),
  metadata: jsonb("metadata"), // For storing rich, structured data about the event
  tags: text("tags").array(), // For categorization and filtering
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// --- RELATIONS ---
// Defining relations enables powerful, type-safe queries across tables.

export const matchesRelations = relations(matches, ({ many }) => ({
  // A match can have many commentary entries.
  commentaries: many(commentary),
}));

export const commentaryRelations = relations(commentary, ({ one }) => ({
  // Each commentary entry belongs to exactly one match.
  match: one(matches, {
    fields: [commentary.matchId],
    references: [matches.id],
  }),
}));
