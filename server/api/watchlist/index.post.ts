export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const DB = useDB();
  const body = await readBody<{ mediaId: number, mediaSlug: string }>(event);
  const { mediaId, mediaSlug } = body;
  const today = Date.now();
  // insert db
  const watchList = await DB.insert(tables.watchList).values({
    mediaId,
    mediaSlug,
    userId: user.id,
    status: watchStatus.PLAN_TO_WATCH.id,
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
