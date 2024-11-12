export const useDetectCrawler = () => {
  const headers = useRequestHeaders();
  const userAgent = headers["user-agent"];
  const botName = [...limitedBots, ...unlimitedBots].find(bot => userAgent?.includes(bot));
  if (botName) return { userAgent, isCrawler: true };
  return { userAgent, isCrawler: false };
};
