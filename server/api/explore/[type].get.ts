const cacheName = "getExploreType";

export default defineCachedEventHandler(async (event) => {
  const { type } = getRouterParams(event);
  const { slug } = getQuery(event) as { slug?: string };
  const cat_title = categories.find(c => fixSlug(c.name) === slug)?.name;
  const cat_type = categories.find(c => fixSlug(c.name) === slug)?.type || null;
  const option = slug ? cat_type === "genre" ? { genres: cat_title ? [cat_title] : null } : { tags: cat_title ? [cat_title] : null } : null;
  const dataHandler = async (): Promise<AnimeList | null> => {
    switch (type) {
      case "newly":
        return (await getNewlyReleased(option)).data;
      case "popular":
        return (await getPopular(option)).data;
      case "rated":
        return (await getTopRated(option)).data;
      case "upcoming":
        return (await getUpcoming(option)).data;
      default:
        return null;
    }
  };

  const data = await dataHandler();
  if (!data) return;

  data.type = type === "newly" ? "new" : type === "popular" ? "trending" : type === "rated" ? "top-rated" : type === "upcoming" ? type : "";
  data.category = cat_title || null;
  data.slug = slug || null;
  return data;
}, {
  maxAge: 43200, // 12h cache
  swr: true,
  name: cacheName,
  getKey: event => (getQuery(event)?.slug as string || "index") + `${getRouterParams(event).type as string}`,
  shouldInvalidateCache: async (event) => {
    const cacheKey = (getQuery(event)?.slug as string || "index") + `${getRouterParams(event).type as string}`;
    const body: AnimeList = await getCachedItemBody(`nitro:handlers:${cacheName}:${cacheKey}.json`);
    const invalidate = body && !body?.media?.length;
    return shouldInvalidateCacheByConditionHandler(event, invalidate);
  }
});
