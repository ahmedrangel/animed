const cacheGroup = "getAnimeInfo";
const cacheName = "index";

export default defineCachedEventHandler(async (event) => {
  const userAgent = getHeaders(event)["user-agent"];
  const isBot = knownBots.find(bot => userAgent?.includes(bot)) ? true : false;
  const limited = await botRateLimitHandler(userAgent);
  if (limited)
    return new Response(null, { status: 429, statusText: "Too many requests" });

  const { id } = getRouterParams(event);
  const obj = await getAnimeInfo({ id: Number(id) });
  const slug = fixSlug(obj.title.romaji);
  obj.slug = slug;

  if (!isBot) {
    const animeflv = await getAflvSearch(encodeURIComponent(obj?.title?.english || obj?.title?.native), userAgent);
    if (animeflv?.length) {
      const foundRelation = animeFlvRelationLogic(animeflv, obj);
      if (foundRelation) obj.externalLinks.push(foundRelation);
    }
  }

  return obj;
}, {
  maxAge: 43200,
  varies: ["user-agent"],
  swr: true,
  group: cacheGroup,
  name: cacheName,
  getKey: event => getRouterParams(event).id,
  shouldInvalidateCache: async (event) => {
    const cacheKey = getRouterParams(event).id;
    const body: Anime = await getCachedItemBody(`${cacheGroup}:${cacheName}:${cacheKey}.json`);
    const invalidate = body && !body?.id;
    return shouldInvalidateCacheByConditionHandler(event, invalidate);
  }
});
