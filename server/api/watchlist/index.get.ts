export default defineEventHandler(async (event) => {
  const DB = useDB();
  const { userId, page } = getQuery<{ userId: number, page?: number }>(event);
  const limit = 50;
  const offset = page ? (Number(page) - 1) * limit : null;
  const statusOrder = [1, 2, 3, 4, 0];
  let query;
  query = DB.select({
    userId: tables.watchList.userId,
    mediaId: tables.watchList.mediaId,
    mediaSlug: tables.watchList.mediaSlug,
    status: tables.watchList.status,
    score: tables.watchList.score,
    progress: tables.watchList.progress,
    startedDate: tables.watchList.startedDate,
    finishedDate: tables.watchList.finishedDate,
    updatedAt: tables.watchList.updatedAt
  }).from(tables.watchList).where(eq(tables.watchList.userId, userId))
    .orderBy(sql.raw(`
      CASE status
        ${statusOrder.map((status, index) => `WHEN ${status} THEN ${index + 1}`).join(" ")}
      END,
      media_slug ASC
    `));

  if (page && offset) {
    query = query.limit(limit).offset(offset);
  }

  const watchList = await query.all();

  if (!watchList) {
    throw createError({
      statusCode: 404,
      message: `Watchlist not found: ${userId}`,
      fatal: true
    });
  }
  return watchList;
});
