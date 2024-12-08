import type { H3Event } from "h3";

const RATE_LIMIT_MAX_REQ = 2;
const RATE_LIMIT_TIME_FRAME = 1000 * 60 * 5;

export const botRateLimitHandler = async (agent: string | undefined) => {
  const botName = limitedBots.find(bot => agent?.includes(bot));
  console.info("Bot: ", botName);
  if (!botName) return false;
  const KV = hubKV();
  const now = Date.now() as number;
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
