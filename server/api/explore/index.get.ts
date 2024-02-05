export default defineEventHandler(async (event) => {
  const { cloudflare } = event.context;
  const { href: reqURL } = getRequestURL(event);
  let cacheManager = {
    cache: null as any,
    cacheKey: null as Request | null
  };

  // Check cache
  if (!process.dev) {
    const cacheKey = new Request(reqURL, cloudflare.req);
    // @ts-ignore
    const cache = caches.default;
    cacheManager = { cache, cacheKey };
    const response = await cache.match(cacheKey);

    if (response) {
      console.info("Found in cache!");
      return response;
    }
  }

  const { slug } = getQuery(event);
  const cat_id = categories.data.find((c) => c.attributes.slug === slug)?.id || null;
  const cat_title = categories.data.find((c) => c.attributes.slug === slug)?.attributes.title || null;
  const cat_desc = categories.data.find((c) => c.attributes.slug === slug)?.attributes.description || null;
  const popular = await getPopular({ category: cat_id });
  const rated = await getTopRated({ categories: slug });
  const newly = await getNewlyReleased({ categories: slug });
  const data = {
    preview: [
      { title: newly.title, data: newly.data, route: `/c/new${slug ? `/${slug}` : ""}` },
      { title: rated.title, data: rated.data, route: `/c/top-rated${slug ? `/${slug}` : ""}` },
      { title: popular.title, data: popular.data, route: `/c/trending${slug ? `/${slug}` : ""}` },
    ]
  } as Record<string, any>;
  data.slug = slug || null;
  data.category = cat_title;
  data.description = cat_desc;

  const response = new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "s-maxage=3600" // 1h cache
    }
  });

  if (data && !process.dev) {
    console.info("Stored in cache!");
    cloudflare.context.waitUntil(cacheManager.cache.put(cacheManager.cacheKey, response.clone()));
  }

  return response;
});