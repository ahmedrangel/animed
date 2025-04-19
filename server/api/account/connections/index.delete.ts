export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { provider } = getQuery(event);
  const DB = useDB();
  const connection = await DB.delete(tables.socialConnections)
    .where(and(eq(tables.socialConnections.userId, user.id), eq(tables.socialConnections.provider, String(provider))))
    .returning().get();
  if (!connection) {
    throw createError({
      statusCode: 400,
      data: { success: false, message: "Failed to delete connection" }
    });
  }
  return { success: true, message: "Connection deleted successfully" };
});
