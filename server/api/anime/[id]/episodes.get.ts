const cacheGroup = "getAnimeInfo";
const cacheName = "episodes";

export default defineCachedEventHandler(async (event) => {
  const userAgent = getHeaders(event)["user-agent"];
  const limited = await botRateLimitHandler(userAgent);
  if (limited) {
    event.node.res.statusCode = 429;
    event.node.res.statusMessage = "Too many requests";
    return { message: "Too many requests" };
  }

  const { id } = getRouterParams(event);
  const data = await getAnimeEpisodes({ id: Number(id) });
  const slug = fixSlug(data.title.romaji);
  return { ...data, slug };
}, {
  maxAge: 43200, // 12 cache
  varies: ["user-agent"],
  swr: false,
  group: cacheGroup,
  name: cacheName,
  getKey: event => getRouterParams(event).id
});
