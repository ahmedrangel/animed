export const sleep = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

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

const knownBots = ["facebookexternalhit", "GoogleOther", "bingbot", "Googlebot", "GPTBot", "Bytespider", "SemrushBot", "Amazonbot", "meta-externalagent", "YandexBot", "ClaudeBot", "OAI-SearchBot", "DotBot"];

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
