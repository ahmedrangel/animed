import { getExplore } from "~/utils/anilist.client";

export default defineEventHandler(async (event) => {
  const { cloudflare } = event.context;
  const { href: reqURL } = getRequestURL(event);
  let cacheManager = {
    cache: null as any,
    cacheKey: null as Request | null
  };

  // Check cache
  if (!import.meta.dev) {
    const cacheKey = new Request(reqURL, cloudflare.req);
    // @ts-expect-error
    const cache = caches.default;
    cacheManager = { cache, cacheKey };
    const response = await cache.match(cacheKey);

    if (response) {
      const cacheBody = await response.clone().json();
      if (!cacheBody.preview?.newly?.media?.length || !cacheBody.preview?.top?.media?.length || !cacheBody.preview?.trending?.media?.length) {
        console.info("Cache cleared due to not matching required properties!");
        cache.delete(cacheKey);
      }
      else {
        console.info("Found in cache!");
        return response;
      }
    }
  }

  const { slug } = getQuery(event);
  const cat_title = categories.find(c => fixSlug(c.name) === slug)?.name || null;
  const cat_type = categories.find(c => fixSlug(c.name) === slug)?.type || null;
  const option = slug ? cat_type === "genre" ? { genres: [cat_title], slug, category: cat_title } : { tags: [cat_title], slug, category: cat_title } : null as Record<string, any> | null;
  const data = await getExplore(option) as Record<string, any>;
  const response = new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "s-maxage=43200" // 12h cache
    }
  });

  if (data && !import.meta.dev) {
    console.info("Stored in cache!");
    cloudflare.context.waitUntil(cacheManager.cache.put(cacheManager.cacheKey, response.clone()));
  }
  return response;
});
