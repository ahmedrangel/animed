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
  shouldInvalidateCache: async (event) => {
    if (!import.meta.dev) {
      const { cloudflare } = event.context;
      const { href: reqURL } = getRequestURL(event);
      const cacheKey = new Request(reqURL, cloudflare.req);
      // @ts-expect-error
      const cache = caches.default;
      const response = await cache.match(cacheKey);
      if (response) {
        const cacheBody = await response.clone().json();
        if (!cacheBody.preview?.newly?.media?.length || !cacheBody.preview?.top?.media?.length || !cacheBody.preview?.trending?.media?.length) {
          console.info("Cache invalidated due to not matching required properties!");
          return true;
        }
      }
    }
    return false;
  }
});
