export default defineCachedEventHandler(async (event) => {
  const userAgent = getHeaders(event)["user-agent"];
  const limited = await botRateLimitHandler(userAgent);
  if (limited)
    return new Response(null, { status: 429, statusText: "Too many requests" });

  const { id } = getRouterParams(event);
  const obj = await getAnimeEpisodes({ id: Number(id) });
  const response = obj;

  if (response) return response;
}, { maxAge: !import.meta.dev ? 43200 : 1, varies: ["user-agent"] }); // 12h cache
