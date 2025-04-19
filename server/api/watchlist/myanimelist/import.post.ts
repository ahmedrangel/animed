export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const body = await readBody<{
    mediaId: number;
    mediaSlug: string;
    progress: number;
    status: number;
    score: number;
    startedDate?: string;
    finishedDate?: string;
  }[]>(event);
  const DB = useDB();
  const today = Date.now();
  await DB.delete(tables.watchList).where(eq(tables.watchList.userId, user.id)).run();
  const returningList = [];
  for (const item of body) {
    const { mediaId, mediaSlug, progress, status, score, startedDate, finishedDate } = item;
    const returning = await DB.insert(tables.watchList).values({
      mediaId,
      mediaSlug,
      userId: user.id,
      status,
      progress,
      score,
      startedDate: startedDate || null,
      finishedDate: finishedDate || null,
      updatedAt: today
    }).onConflictDoNothing().returning().get();
    returningList.push(returning);
  }
  if (!returningList.length) {
    throw createError({
      statusCode: 400,
      data: { success: false, message: "Failed to import watchlist" }
    });
  }
  return { success: true, message: `Imported successfully ${returningList.length} items` };
});
