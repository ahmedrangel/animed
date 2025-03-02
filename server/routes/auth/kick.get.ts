export default defineOAuthKickEventHandler({
  async onSuccess (event, { user }) {
    return handleOAuth(event, {
      id: user.user_id,
      email: user.email
    }, "kick");
  }
});
