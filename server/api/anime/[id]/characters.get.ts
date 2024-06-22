export default defineCachedEventHandler(async (event) => {
  const userAgent = getHeaders(event)["user-agent"];
  const limited = await botRateLimitHandler(userAgent);
  if (limited)
    return new Response(null, { status: 429, statusText: "Too many requests" });

  const { id } = getRouterParams(event);
  const { data } = await getAnimeCharacters({ id: Number(id) });
  const obj = data.Media;

  const response = obj;

  if (response) return response;
}, { maxAge: !import.meta.dev ? 43200 : 0 }); // 12h cache
