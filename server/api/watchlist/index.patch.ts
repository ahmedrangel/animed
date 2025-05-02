export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const DB = useDB();
  const body = await readBody(event);
  const { mediaId } = body;
  const today = Date.now();
  // insert db
  const updated = await DB.update(tables.watchList).set({
    ...body,
    updatedAt: today
  }).where(and(eq(tables.watchList.mediaId, Number(mediaId)), eq(tables.watchList.userId, Number(user.id)))).returning().get();

  if (!updated) {
    throw createError({
      statusCode: 400,
      data: { success: false, message: "Failed to update to watchlist" }
    });
  }
  return updated;
});
