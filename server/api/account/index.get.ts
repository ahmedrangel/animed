export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const DB = useDB();
  const { username } = getQuery<{ username: string }>(event);
  if (username) {
    const userExists = await DB.select({
      username: tables.users.username
    }).from(tables.users).where(eq(tables.users.username, username)).get();
    if (userExists) throw createError({ statusCode: 400, data: { success: false, message: "Username already in use" } });
  }
  return { success: true };
});
