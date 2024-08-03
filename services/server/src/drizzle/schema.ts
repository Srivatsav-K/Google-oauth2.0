import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const UserRole = pgEnum("user_role", ["ADMIN", "BASIC"]);

export const Users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    googleId: text("google_id").notNull(),
    role: UserRole("role").default("BASIC").notNull(),
    refreshTokenVersion: integer("refresh_token_version").default(1).notNull(),
    createdAt: timestamp("created_at", {
      precision: 3,
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      precision: 3, // upto 3 ms
      withTimezone: true,
    })
      .$onUpdate(() => sql`CURRENT_TIMESTAMP(3)`)
      .defaultNow()
      .notNull(), // update the time when the row is modified
  },
  (table) => {
    return { emailIndex: index("email_index").on(table.email) };
  }
);

export const Notes = pgTable(
  "notes",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),
    isArchived: boolean("is_archived").default(false),
    tags: text("tags")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`), // https://orm.drizzle.team/learn/guides/empty-array-default-value#postgresql
    userId: uuid("user_id")
      .references(() => Users.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at", {
      precision: 3,
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      precision: 3, // upto 3 ms
      withTimezone: true,
    })
      .$onUpdate(() => sql`CURRENT_TIMESTAMP(3)`)
      .defaultNow()
      .notNull(), // update the time when the row is modified
  },
  (table) => {
    return { userIndex: index("user_index").on(table.userId) };
  }
);
