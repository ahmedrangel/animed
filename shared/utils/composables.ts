export const useDetectCrawler = (option: { "user-agent"?: string }) => {
  const userAgent = option["user-agent"];
  const botName = [...limitedBots, ...unlimitedBots].find(bot => userAgent?.includes(bot));
  if (botName) return { userAgent, isCrawler: true };
  return { userAgent, isCrawler: false };
};
