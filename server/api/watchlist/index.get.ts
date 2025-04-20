export default defineEventHandler(async (event) => {
  const DB = useDB();
  const { userId, page, sort, order, status } = getQuery<{ userId: number, page?: number, sort?: string, order?: "init" | "asc" | "desc", status?: number | null }>(event);
  const limit = 50;
  const offset = page ? (Number(page) - 1) * limit : 0;
  const normalStatusOrder = [1, 2, 3, 4, 0];
  const invertedStatusOrder = normalStatusOrder.toReversed();
  const orderType = order ? order : "init";
  const statusOrder = orderType === "asc" || orderType === "init" ? normalStatusOrder : invertedStatusOrder;
  const sortColumn = sort && orderType !== "init" ? tables.watchList[sort as keyof typeof tables.watchList] as SQLiteColumn : null;
  const whereCondition = status ? and(eq(tables.watchList.userId, userId), eq(tables.watchList.status, Number(status))) : eq(tables.watchList.userId, userId);
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
  }).from(tables.watchList).where(whereCondition)
    .orderBy(sortColumn ? orderType === "asc" ? asc(sortColumn) : desc(sortColumn) : sql.raw(`
      CASE status
        ${statusOrder.map((status, index) => `WHEN ${status} THEN ${index + 1}`).join(" ")}
      END,
      media_slug ASC
    `));

  if (page) {
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
