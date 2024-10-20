const cacheName = "getExplore";

export default defineCachedEventHandler(async (event) => {
  const { slug } = getQuery(event) as { slug?: string };
  const cat_title = categories.find(c => fixSlug(c.name) === slug)?.name;
  const cat_type = categories.find(c => fixSlug(c.name) === slug)?.type || null;
  const option = slug ? cat_type === "genre" ? { genres: cat_title ? [cat_title] : null } : { tags: cat_title ? [cat_title] : null } : null;
  const response = await getExplore({ ...option, slug, category: cat_title, perPage: 12 });
  return response;
}, {
  maxAge: 43200,
  swr: true,
  name: cacheName,
  getKey: event => getQuery(event)?.slug as string || "index",
  shouldInvalidateCache: async (event) => {
    const cacheKey = (getQuery(event)?.slug as string || "index");
    const body: AnimePreviewList = await getCachedItemBody(`nitro:handlers:${cacheName}:${cacheKey}.json`);
    const condition = !body || !body.preview?.newly?.media?.length || !body.preview?.top?.media?.length || !body.preview?.trending?.media?.length;
    return shouldInvalidateCacheByConditionHandler(event, condition);
  }
});
