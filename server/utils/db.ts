import { drizzle } from "drizzle-orm/d1";
import * as schema from "../database/schema";

export { sql, eq, and, or, count, desc, asc, exists, notExists } from "drizzle-orm";
export type { SQLiteColumn } from "drizzle-orm/sqlite-core";

export const tables = schema;

export const useDB = () => {
  return drizzle(hubDatabase(), { schema, casing: "snake_case" });
};

export const createConnection = async (userId: number, provider: string, providerId: string) => {
  const DB = useDB();
  const today = Date.now();
  return await DB.insert(tables.socialConnections).values({
    userId,
    provider,
    providerId: providerId.toString(),
    createdAt: today,
    updatedAt: today
  }).onConflictDoNothing().returning().get();
};
