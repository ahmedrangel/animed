import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text(),
  username: text().unique(),
  password: text(),
  email: text().notNull().unique(),
  birthday: integer(),
  country: text(),
  aboutMe: text(),
  createdAt: integer().notNull(),
  updatedAt: integer().notNull()
});

export const socialConnections = sqliteTable("social_connections", {
  id: integer().primaryKey(),
  userId: integer().references(() => users.id, { onDelete: "cascade" }),
  provider: text().notNull(),
  providerId: text().notNull(),
  createdAt: integer().notNull(),
  updatedAt: integer().notNull()
});

export const watchList = sqliteTable("watch_list", {
  mediaId: integer().notNull(),
  userId: integer().references(() => users.id, { onDelete: "cascade" }),
  status: integer().notNull(),
  score: integer(),
  progress: integer().notNull(),
  startedDate: integer(),
  finishedDate: integer(),
  updatedAt: integer().notNull()
}, table => [
  primaryKey({ columns: [table.mediaId, table.userId] })
]);
