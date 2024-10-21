const cacheGroup = "getAnimeInfo";
const cacheName = "slug";

export default defineCachedEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const data = await getAnimeSlug(Number(id));
  const slug = fixSlug(data.title.romaji);
  const obj = { id, slug };
  return obj;
}, {
  maxAge: 604800, // 1w cache
  swr: true,
  group: cacheGroup,
  name: cacheName,
  getKey: event => getRouterParams(event).id,
  shouldInvalidateCache: async (event) => {
    const cacheKey = getRouterParams(event).id;
    const body: { id: number, slug: string } = await getCachedItemBody(`${cacheGroup}:${cacheName}:${cacheKey}.json`);
    const invalidate = body && !body?.id;
    return shouldInvalidateCacheByConditionHandler(event, invalidate);
  }
});
