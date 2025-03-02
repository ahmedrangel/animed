export default defineOAuthDiscordEventHandler({
  config: {
    emailRequired: true,
    profileRequired: true
  },
  async onSuccess (event, { user }) {
    return handleOAuth(event, {
      id: user.id,
      email: user.email
    }, "discord");
  }
});
