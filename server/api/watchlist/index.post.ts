export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const DB = useDB();
  const body = await readBody<{ mediaId: number, userId: number }>(event);
  const { mediaId, userId } = body;
  const today = Date.now();
  // insert db
  const watchList = await DB.insert(tables.watchList).values({
    mediaId,
    userId,
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
