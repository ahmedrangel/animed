export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const deleted = await db.delete(tables.users).where(and(eq(tables.users.id, user.id))).returning().get();
  if (!deleted) throw createError({ statusCode: 500, data: { success: false } });
  return { success: true };
});
