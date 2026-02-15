import * as schema from "../db/schema";

export { sql, eq, and, or, count, desc, asc, exists, notExists } from "drizzle-orm";
export type { SQLiteColumn } from "drizzle-orm/sqlite-core";

export const tables = schema;

export const createConnection = async (userId: number, provider: string, providerId: string) => {
  const today = Date.now();
  return await db.insert(tables.socialConnections).values({
    userId,
    provider,
    providerId: providerId.toString(),
    createdAt: today,
    updatedAt: today
  }).onConflictDoNothing().returning().get();
};
