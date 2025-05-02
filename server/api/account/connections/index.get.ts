export default defineEventHandler(async (event): Promise<AccountConnection[]> => {
  const { user } = await requireUserSession(event);
  const DB = useDB();
  // Get user connections
  const connections = await DB.select({
    id: tables.socialConnections.id,
    provider: tables.socialConnections.provider,
    providerId: tables.socialConnections.providerId,
    createdAt: tables.socialConnections.createdAt,
    updatedAt: tables.socialConnections.updatedAt
  }).from(tables.socialConnections).where(eq(tables.socialConnections.userId, user.id)).all();
  return connections;
});
