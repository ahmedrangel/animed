export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const body = await readBody(event);
  const DB = useDB();
  const today = Date.now();
  // update db
  const updated = await DB.update(tables.users).set({
    ...body,
    updatedAt: today
  }).where(and(eq(tables.users.id, user.id))).returning().get();
  if (!updated) throw createError({ statusCode: 500, data: { success: false } });
  await setUserSession(event, { user: { ...user, ...updated } });
  return { success: true };
});
