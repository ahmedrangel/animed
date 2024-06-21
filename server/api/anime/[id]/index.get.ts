import { Language } from "~/enums/anilist";

export default defineEventHandler(async (event) => {
  await botRateLimitHandler(event);
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
      console.info("Found in cache!");
      return response;
    }
  }

  const { id } = getRouterParams(event);
  const { data } = await getAnimeInfo({ id: Number(id), language: Language.JAPANESE });
  const obj = data.Media;
  const slug = fixSlug(obj.title.romaji);
  obj.slug = slug;

  const animeflv = await getAflvSearch(encodeURIComponent(obj?.title?.english || obj?.title?.native));
  if (animeflv?.length) {
    const foundRelation = animeFlvRelationLogic(animeflv, obj);
    foundRelation ? obj.externalLinks.push(foundRelation) : null;
  }

  const response = new Response(JSON.stringify(obj), {
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
