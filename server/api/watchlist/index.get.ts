export default defineEventHandler(async (event): Promise<Watchlist[]> => {
  const DB = useDB();
  const params = getQuery<{ userId: number, page?: number, sort?: string, order?: "init" | "asc" | "desc", status?: number | null }>(event);
  const userSession = await getUserSession(event);
  const userId = params.userId || userSession?.user?.id || null;
  if (!userId) {
    throw createError({
      statusCode: 401,
      message: "Must provide userId or be logged in",
      fatal: true
    });
  }
  const statusOrder = [1, 2, 3, 4, 0];
  const whereCondition = eq(tables.watchList.userId, Number(userId));
  const query = DB.select({
    userId: tables.watchList.userId,
    mediaId: tables.watchList.mediaId,
    mediaSlug: tables.watchList.mediaSlug,
    status: tables.watchList.status,
    score: tables.watchList.score,
    progress: tables.watchList.progress,
    startedDate: tables.watchList.startedDate,
    finishedDate: tables.watchList.finishedDate,
    updatedAt: tables.watchList.updatedAt
  }).from(tables.watchList).where(whereCondition)
    .orderBy(sql.raw(`
      CASE status
        ${statusOrder.map((status, index) => `WHEN ${status} THEN ${index + 1}`).join(" ")}
      END,
      media_slug ASC
    `));

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
