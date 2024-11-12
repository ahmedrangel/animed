const cacheGroup = "getAnimeInfo";
const cacheName = "id";

export default defineCachedEventHandler(async (event) => {
  const userAgent = getHeaders(event)["user-agent"];
  const limited = await botRateLimitHandler(userAgent);
  console.log(limited);
  if (limited)
    return new Response(null, { status: 429, statusText: "Too many requests" });

  const { id } = getRouterParams(event);
  const data = await getAnimeInfo({ id: Number(id) });
  const slug = fixSlug(data.title.romaji);
  return { ...data, slug };
}, {
  maxAge: 43200, // 12 cache
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
