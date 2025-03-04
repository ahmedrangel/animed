export default defineEventHandler(async (event) => {
  const DB = useDB();
  const { userId } = getQuery<{ userId: number }>(event);
  const watchList = await DB.select({
    userId: tables.watchList.userId,
    mediaId: tables.watchList.mediaId,
    status: tables.watchList.status,
    score: tables.watchList.score,
    progress: tables.watchList.progress,
    startedDate: tables.watchList.startedDate,
    finishedDate: tables.watchList.finishedDate,
    updatedAt: tables.watchList.updatedAt
  }).from(tables.watchList).where(eq(tables.watchList.userId, userId)).all();

  if (!watchList) {
    throw createError({
      statusCode: 404,
      message: `Watchlist not found: ${userId}`,
      fatal: true
    });
  }

  return watchList;
});
