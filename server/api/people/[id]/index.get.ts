export default defineCachedEventHandler(async (event) => {
  const userAgent = getHeaders(event)["user-agent"];
  const limited = await botRateLimitHandler(userAgent);
  if (limited)
    return new Response(null, { status: 429, statusText: "Too many requests" });

  const { id } = getRouterParams(event);
  const { data } = await getStaff({ id: Number(id) });
  const obj = data.Staff;

  const response = obj;

  if (response) return response;
}, { maxAge: !import.meta.dev ? 43200 : 1, varies: ["user-agent"] });// 12h cache
