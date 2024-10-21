const cacheGroup = "getAnimeInfo";
const cacheName = "characters";

export default defineCachedEventHandler(async (event) => {
  const userAgent = getHeaders(event)["user-agent"];
  const limited = await botRateLimitHandler(userAgent);
  if (limited)
    return new Response(null, { status: 429, statusText: "Too many requests" });

  const { id } = getRouterParams(event);
  return await getAnimeCharacters({ id: Number(id) });
}, {
  maxAge: 43200,
  varies: ["user-agent"],
  swr: true,
  group: cacheGroup,
  name: cacheName,
  getKey: event => getRouterParams(event).id,
  shouldInvalidateCache: async (event) => {
    const cacheKey = getRouterParams(event).id;
    const body = await getCachedItemBody(`${cacheGroup}:${cacheName}:${cacheKey}.json`);
    const invalidate = body && !body?.id;
    return shouldInvalidateCacheByConditionHandler(event, invalidate);
  }
});
