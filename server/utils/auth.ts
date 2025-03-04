export const handleOAuth = async (event: H3Event, userOptions: { id: string, email: string }, provider: string) => {
  const { id, email } = userOptions;
  const DB = useDB();
  const today = Date.now();
  let authUser = await DB.select({
    id: tables.users.id,
    name: tables.users.name,
    username: tables.users.username,
    email: tables.users.email,
    birthday: tables.users.birthday,
    country: tables.users.country,
    aboutMe: tables.users.aboutMe,
    createdAt: tables.users.createdAt,
    updatedAt: tables.users.updatedAt
  }).from(tables.users).where(and(eq(tables.users.email, email))).get();

  if (!userOptions) return sendRedirect(event, "/login?error=signin_auth_error");

  if (!authUser?.id) {
    authUser = await DB.insert(tables.users).values({
      email,
      createdAt: today,
      updatedAt: today
    }).onConflictDoNothing().returning().get();
    if (!authUser) return sendRedirect(event, "/login?error=signin_auth_error");
    const connection = await createConnection(authUser.id, provider, id);
    if (!connection?.provider) console.info(`${provider} connection failed to save`);
  }

  const checkConnection = await DB.select({
    id: tables.socialConnections.id
  }).from(tables.socialConnections)
    .where(and(eq(tables.socialConnections.userId, authUser.id), eq(tables.socialConnections.provider, provider)))
    .get();

  if (!checkConnection && email === authUser.email) {
    return sendRedirect(event, "/login?error=email_already_registered");
  }

  const { secure } = useRuntimeConfig();
  const userHash = await hash(String(email), secure.salt);
  await setUserSession(event, {
    user: {
      ...authUser,
      hash: userHash
    }
  });
  console.info("User logged in: ", email);
  return sendRedirect(event, "/");
};
