export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  // Get user connections
  const connections = await db.select({
    id: tables.socialConnections.id,
    provider: tables.socialConnections.provider,
    providerId: tables.socialConnections.providerId,
    createdAt: tables.socialConnections.createdAt,
    updatedAt: tables.socialConnections.updatedAt
  }).from(tables.socialConnections).where(eq(tables.socialConnections.userId, user.id)).all();
  return connections;
});
