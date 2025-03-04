export default defineEventHandler(async (event) => {
  const DB = useDB();
  const { username } = getRouterParams(event);
  const user = await DB.select({
    id: tables.users.id,
    name: tables.users.name,
    username: tables.users.username,
    country: tables.users.country,
    aboutMe: tables.users.aboutMe,
    createdAt: tables.users.createdAt,
    updatedAt: tables.users.updatedAt
  }).from(tables.users).where(eq(sql`lower(${tables.users.username})`, username.toLowerCase())).get();
  if (!user) {
    throw createError({
      statusCode: 404,
      message: `User not found: ${username}`,
      fatal: true
    });
  }
  return user;
});
