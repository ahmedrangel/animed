export const handleOAuth = async (event: H3Event, userOptions: { id: string, email: string }, provider: string) => {
  const { id, email } = userOptions;
  const DB = useDB();
  const today = Date.now();
  const session = await getUserSession(event);
  try {
    if (!session.user) {
      const checkConnection = await DB.select({
        id: tables.socialConnections.id,
        userId: tables.socialConnections.userId
      }).from(tables.socialConnections)
        .where(and(eq(tables.socialConnections.providerId, id), eq(tables.socialConnections.provider, provider)))
        .get();
      let authUser;
      if (!checkConnection?.userId) {
        authUser = await DB.select({
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

        if (!checkConnection && authUser && email === authUser.email) {
          return sendRedirect(event, "/login?error=email_already_registered");
        }

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
      }

      authUser = authUser ? authUser : await DB.select({
        id: tables.users.id,
        name: tables.users.name,
        username: tables.users.username,
        email: tables.users.email,
        birthday: tables.users.birthday,
        country: tables.users.country,
        aboutMe: tables.users.aboutMe,
        createdAt: tables.users.createdAt,
        updatedAt: tables.users.updatedAt
      }).from(tables.users).where(and(eq(tables.users.id, checkConnection!.userId!))).get();

      if (!authUser) return sendRedirect(event, "/login?error=signin_auth_error");

      const { secure } = useRuntimeConfig();
      const userHash = await hash(String(authUser.id), secure.salt);
      await setUserSession(event, {
        user: {
          ...authUser,
          hash: userHash
        }
      });
      console.info("User logged in: ", email);
      return sendRedirect(event, "/");
    }
    else {
      const checkConnection = await DB.select({
        id: tables.socialConnections.id,
        userId: tables.socialConnections.userId
      }).from(tables.socialConnections)
        .where(and(eq(tables.socialConnections.providerId, id), eq(tables.socialConnections.provider, provider)))
        .get();

      if (checkConnection && checkConnection.userId !== session.user.id) {
        return sendRedirect(event, `/u/${session.user.username}/settings?error=connection_already_exists&provider=${provider}`);
      }

      if (!checkConnection?.userId) {
        const connection = await createConnection(session.user.id, provider, id);
        if (!connection?.provider) console.info(`${provider} connection failed to save`);
      }

      const { secure } = useRuntimeConfig();
      const userHash = await hash(String(session.user.id), secure.salt);
      await setUserSession(event, {
        user: {
          ...session.user,
          hash: userHash
        }
      });
      return sendRedirect(event, `/u/${session.user.username}/settings`);
    }
  }
  catch (error) {
    console.info(error);
    clearUserSession(event);
    return sendRedirect(event, "/login?error=signin_auth_error");
  }
};
