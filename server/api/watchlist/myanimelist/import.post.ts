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
    updatedAt?: number;
  }[]>(event);
  const DB = useDB();
  const today = Date.now();
  await DB.delete(tables.watchList).where(eq(tables.watchList.userId, user.id)).run();
  const mapValues = body.map(({ mediaId, mediaSlug, progress, status, score, startedDate, finishedDate, updatedAt }) => {
    return {
      mediaId,
      mediaSlug,
      userId: user.id,
      status,
      progress,
      score,
      startedDate: startedDate || null,
      finishedDate: finishedDate || null,
      updatedAt: updatedAt || today
    };
  });
  const chunkSize = 111;
  let importedCount = 0;
  const insertQuery = (values: string) => `INSERT INTO watch_list (media_id, media_slug, user_id, status, progress, score, started_date, finished_date, updated_at) VALUES ${values}`;
  for (let i = 0; i < mapValues.length; i += chunkSize) {
    const chunk = mapValues.slice(i, i + chunkSize);
    const values = chunk.map(({ mediaId, mediaSlug, userId, status, progress, score, startedDate, finishedDate, updatedAt }) => {
      return `(${mediaId}, '${mediaSlug}', ${userId}, ${status}, ${progress}, ${score}, ${startedDate ? `'${startedDate}'` : null}, ${finishedDate ? `'${finishedDate}'` : null}, ${updatedAt})`;
    }).join(", ");
    const returning = import.meta.dev ? await hubDatabase().exec(insertQuery(values)) : await event.context.cloudflare.env.DB.exec(insertQuery(values));
    if (returning.count) importedCount = importedCount + chunk.length;
  }
  if (!importedCount) {
    throw createError({
      statusCode: 400,
      data: { success: false, message: "Failed to import watchlist" }
    });
  }
  return { success: true, message: `Imported successfully ${importedCount} items` };
});
