export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const DB = useDB();
  const { mediaId } = getQuery<{ mediaId: number }>(event);
  // delete db
  const deleted = await DB.delete(tables.watchList).where(
    and(eq(tables.watchList.mediaId, mediaId), eq(tables.watchList.userId, user.id))
  ).returning().get();
  if (!deleted) {
    throw createError({
      statusCode: 400,
      data: { success: false, message: "Failed to delete item from watchlist" }
    });
  }
  return { success: true };
});
