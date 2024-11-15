import { createStorage } from "unstorage";
import indexedDbDriver from "unstorage/drivers/indexedb";

export const useDetectCrawler = (userAgent: string | undefined) => {
  const botName = [...limitedBots, ...unlimitedBots].find(bot => userAgent?.includes(bot));
  if (botName) {
    return { userAgent, isCrawler: true };
  }
  return { userAgent, isCrawler: false };
};

const storage = createStorage({
  driver: indexedDbDriver({ base: "animed-app:" })
});

export const useIDBStorage = () => {
  return storage;
};
