import type { H3Event } from "h3";

export { categories } from "~/utils/categories";
export { fixSlug } from "~/utils/helpers";
export { getAnimeInfo, getNewlyReleased, getPopular, getTopRated, getAnimeSlug, getAnimeCharacters, getAnimeEpisodes, getStaff, getStaffSlug, getExplore, getUpcoming } from "~/utils/anilist.client";
export { getAflvSearch } from "~/utils/animeflv.client";

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
const RATE_LIMIT_TIME_FRAME = 1000 * 60;

const knownBots = ["facebookexternalhit"];

export const botRateLimitHandler = async (event: H3Event) => {
  const RATE_LIMIT_KV = process.env.ANIMED_BOT_RATE_LIMIT_BUCKET as any;
  const userAgent = event.headers.get("user-agent") as string;
  const now = Date.now() as number;
  const botName = knownBots.find(bot => userAgent.includes(bot));
  if (!botName) return false;

  const rawBotRecord = await RATE_LIMIT_KV.get(botName);

  let botRecord = rawBotRecord ? JSON.parse(rawBotRecord) : { count: 0, lastReq: now };

  if (now - botRecord.lastReq > RATE_LIMIT_TIME_FRAME) {
    botRecord = { count: 0, lastReq: now };
  }

  botRecord.count++;
  await RATE_LIMIT_KV.put(botName, JSON.stringify(botRecord));

  if (botRecord.count > RATE_LIMIT_MAX_REQ) {
    console.info("Limited: " + botName);
    return true;
  }
  return false;
};
