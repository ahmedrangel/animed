const cacheGroup = "getAnimeInfo";
const cacheName = "slug";

export default defineCachedEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const data = await getAnimeSlug(Number(id));
  const slug = fixSlug(data.title.romaji);
  return { id, slug };
}, {
  maxAge: 604800, // 1w cache
  swr: false,
  group: cacheGroup,
  name: cacheName,
  getKey: event => getRouterParams(event).id as string
});
