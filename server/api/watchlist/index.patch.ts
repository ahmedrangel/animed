export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const DB = useDB();
  const body = await readBody<Record<string, number>>(event);
  const { mediaId, userId } = body;
  const today = Date.now();
  // insert db
  const updated = await DB.update(tables.watchList).set({
    ...body,
    updatedAt: today
  }).where(
    and(eq(tables.watchList.mediaId, mediaId), eq(tables.watchList.userId, userId))
  ).returning().get();

  if (!updated) {
    throw createError({
      statusCode: 400,
      data: { success: false, message: "Failed to update to watchlist" }
    });
  }
  return updated;
});
