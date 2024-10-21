import type { H3Event } from "h3";

export const animeFlvRelationLogic = (aflvArr: Record<string, any>[], anilistObj: Record<string, any>) => {
  for (const aflv of aflvArr) {
    if (aflv?.type === "Anime"
      && (
        aflv?.slug?.replace("-tv", "") === anilistObj?.slug
        || aflv?.title?.toLowerCase()?.replace(/[^\w]/g, "") === anilistObj?.title?.english?.toLowerCase()?.replace(/[^\w]/g, "")
        || aflv?.title?.toLowerCase()?.replace(/[^\w]/g, "") === anilistObj?.title?.romaji?.toLowerCase()?.replace(/[^\w]/g, "")
        || anilistObj?.title?.english?.toLowerCase()?.replace(/[^\w]/g, "").includes(aflv?.title?.toLowerCase()?.replace(/[^\w]/g, ""))
        || anilistObj?.title?.romaji?.toLowerCase()?.replace(/[^\w]/g, "").includes(aflv?.title?.toLowerCase()?.replace(/[^\w]/g, ""))
      )) {
      return {
        site: "AnimeFLV",
        url: aflv?.url,
        icon: "/images/aflv.png",
        color: "#2f353a"
      };
    }
  }
};

const RATE_LIMIT_MAX_REQ = 2;
const RATE_LIMIT_TIME_FRAME = 1000 * 60 * 5;

export const knownBots = [
  "facebookexternalhit",
  "GoogleOther",
  "bingbot",
  "Googlebot",
  "GPTBot",
  "Bytespider",
  "SemrushBot",
  "Amazonbot",
  "meta-externalagent",
  "YandexBot",
  "ClaudeBot",
  "OAI-SearchBot",
  "DotBot",
  "BacklinksExtendedBot"
];

export const botRateLimitHandler = async (agent: string | undefined) => {
  const RATE_LIMIT_KV = process.env.ANIMED_BOT_RATE_LIMIT_BUCKET as any;
  const now = Date.now() as number;
  const botName = knownBots.find(bot => agent?.includes(bot));
  if (!botName) return false;
  console.info("Bot: " + botName);

  const rawBotRecord = await RATE_LIMIT_KV.get(botName);
  if (!rawBotRecord) {
    await RATE_LIMIT_KV.put(botName, JSON.stringify({
      count: 1,
      lastReq: now
    }));
    return false;
  }

  const botRecord = JSON.parse(rawBotRecord);

  const count = botRecord.count || 0;
  const lastReq = botRecord.lastReq;
  const diff = now - lastReq;
  if (diff < RATE_LIMIT_TIME_FRAME && count >= RATE_LIMIT_MAX_REQ) {
    return true;
  }
  else if (diff >= RATE_LIMIT_TIME_FRAME) {
    await RATE_LIMIT_KV.put(botName, JSON.stringify({
      count: 1,
      lastReq: now
    }));
    return false;
  }

  await RATE_LIMIT_KV.put(botName, JSON.stringify({
    count: count + 1,
    lastReq: now
  }));
  return false;
};

export const shouldInvalidateCacheByConditionHandler = (event: H3Event, invalidate: boolean) => {
  console.log(invalidate)
  if (!invalidate) return invalidate;
  console.info("Cache invalidated due to not matching required properties!");
  event.node.res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
  event.node.res.setHeader("Pragma", "no-cache");
  event.node.res.setHeader("Expires", "0");
  event.node.res.setHeader("Surrogate-Control", "no-store");
  const uniqueId = Date.now().toString();
  event.node.res.setHeader("X-Response-ID", uniqueId);
  return invalidate;
};

export const getCachedItemBody = async (itemKey: string) => {
  const storage = useStorage("cache");
  const cache = await storage.getItem(itemKey.replace(/-/g, "")) as CacheEntry<{ body: any }>;
  return cache?.value?.body;
};
