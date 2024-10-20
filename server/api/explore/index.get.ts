export default defineCachedEventHandler(async (event) => {
  const { slug } = getQuery(event) as { slug?: string };
  const cat_title = categories.find(c => fixSlug(c.name) === slug)?.name;
  const cat_type = categories.find(c => fixSlug(c.name) === slug)?.type || null;
  const option = slug ? cat_type === "genre" ? { genres: cat_title ? [cat_title] : null } : { tags: cat_title ? [cat_title] : null } : null;
  const response = await getExplore({ ...option, slug, category: cat_title, perPage: 12 });
  return response;
}, {
  maxAge: !import.meta.dev ? 43200 : 1,
  swr: true,
  name: "getExplore",
  getKey: (event) => {
    const { slug } = getQuery(event) as { slug?: string };
    return slug ? slug : "default";
  },
  shouldInvalidateCache: async (event) => {
    const { slug } = getQuery(event) as { slug?: string };
    const cacheKey = slug ? slug : "default";
    const storageValue = `nitro:handlers:getExplore:${cacheKey}.json`;
    const storage = await useStorage("cache").getItem(storageValue);
    const cache = JSON.parse(JSON.stringify(storage));
    const response = cache?.value?.body;
    if (response) {
      if (!response.preview?.newly?.media?.length || !response.preview?.top?.media?.length || !response.preview?.trending?.media?.length) {
        console.info("Cache invalidated due to not matching required properties!");
        event.node.res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
        event.node.res.setHeader("Pragma", "no-cache");
        event.node.res.setHeader("Expires", "0");
        event.node.res.setHeader("Surrogate-Control", "no-store");
        const uniqueId = Date.now().toString();
        event.node.res.setHeader("X-Response-ID", uniqueId);
        return true;
      }
    }
    return false;
  }
});
