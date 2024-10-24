const cacheGroup = "getStaffInfo";
const cacheName = "slug";

export default defineCachedEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const name = await getStaffSlug(Number(id));
  const slug = fixSlug(name);
  return { id, slug };
}, {
  maxAge: 604800, // 1w cache
  swr: true,
  varies: ["user-agent"],
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
