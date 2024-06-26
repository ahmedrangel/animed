import { Language } from "~/enums/anilist";

export default defineCachedEventHandler(async (event) => {
  const userAgent = getHeaders(event)["user-agent"];
  const limited = await botRateLimitHandler(userAgent);
  if (limited)
    return new Response(null, { status: 429, statusText: "Too many requests" });

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

  const response = obj;

  if (response) return response;
}, { maxAge: !import.meta.dev ? 43200 : 0, varies: ["user-agent"] }); // 12h cache
