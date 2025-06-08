export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const DB = useDB();
  const body = await readBody<{ mediaId: number, mediaSlug: string, status: number }>(event);
  const { mediaId, mediaSlug, status } = body;
  const today = Date.now();
  // insert db
  const watchList = await DB.insert(tables.watchList).values({
    mediaId,
    mediaSlug,
    userId: user.id,
    status,
    progress: 0,
    updatedAt: today
  }).onConflictDoNothing().returning().get();
  if (!watchList) {
    throw createError({
      statusCode: 400,
      data: { success: false, message: "Failed to add to watchlist" }
    });
  }
  return watchList;
});
