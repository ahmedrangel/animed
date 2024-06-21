export default defineEventHandler(async (event) => {
  const userAgent = event.headers.get("user-agent");
  const RATE_LIMIT_KV = process.env.ANIMED_BOT_RATE_LIMIT_BUCKET as any;
  const now = Date.now() as number;
  const botName = knownBots.find(bot => userAgent?.includes(bot));
  if (botName) {
    console.info("Bot: " + botName);

    const rawBotRecord = await RATE_LIMIT_KV.get(botName);

    const botRecord = JSON.parse(rawBotRecord);

    const count = botRecord.count || 0;
    const lastReq = botRecord.lastReq;

    if ((now - lastReq) > RATE_LIMIT_TIME_FRAME) {
      await RATE_LIMIT_KV.put(botName, JSON.stringify({ count: 0, lastReq: now }));
    }
    else if (count > RATE_LIMIT_MAX_REQ) {
      console.info("Limited: " + botName);
      await RATE_LIMIT_KV.put(botName, JSON.stringify({ count: 0, lastReq: now }));
      throw createError({ statusCode: 429, statusMessage: "Too many requests" });
    }

    await RATE_LIMIT_KV.put(botName, JSON.stringify({ count: count + 1, lastReq: now }));
  }

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
  const { data } = await getAnimeCharacters({ id: Number(id) });
  const obj = data.Media;

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
