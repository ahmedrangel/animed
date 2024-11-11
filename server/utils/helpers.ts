import type { H3Event } from "h3";

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
  const KV = hubKV();
  const now = Date.now() as number;
  const botName = knownBots.find(bot => agent?.includes(bot));
  if (!botName) return false;
  console.info("Bot: " + botName);
  const keyName = `RateLimitBucket:${botName}`.replace(/-/g, "");
  const botRecord = await KV.get(keyName) as { count: number, lastReq: number };
  if (!botRecord) {
    await KV.set(keyName, { count: 1, lastReq: now });
    return false;
  }

  const count = botRecord?.count || 0;
  const lastReq = botRecord?.lastReq;
  const diff = now - lastReq;
  if (diff < RATE_LIMIT_TIME_FRAME && count >= RATE_LIMIT_MAX_REQ) {
    return true;
  }
  else if (diff >= RATE_LIMIT_TIME_FRAME) {
    await KV.set(keyName, { count: 1, lastReq: now });
    return false;
  }

  await KV.set(keyName, { count: count + 1, lastReq: now });
  return false;
};

export const shouldInvalidateCacheByConditionHandler = (event: H3Event, invalidate: boolean) => {
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
