export const useDetectCrawler = (userAgent: string | undefined) => {
  const botName = [...limitedBots, ...unlimitedBots].find(bot => userAgent?.includes(bot));
  if (botName) {
    return { userAgent, isCrawler: true };
  }
  return { userAgent, isCrawler: false };
};
