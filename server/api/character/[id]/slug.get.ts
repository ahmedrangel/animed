const cacheGroup = "getCharacterInfo";
const cacheName = "slug";

export default defineCachedEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const name = await getCharacterSlug(Number(id));
  const slug = fixSlug(name);
  return { id, slug };
}, {
  maxAge: 604800, // 1w cache
  swr: false,
  varies: ["user-agent"],
  group: cacheGroup,
  name: cacheName,
  getKey: event => getRouterParams(event).id
});
