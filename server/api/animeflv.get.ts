import { searchAnime } from "animeflv-scraper";

const cacheGroup = "getAnimeFLV";
const cacheName = "search";

export default defineCachedEventHandler(async (event) => {
  const { search } = getQuery(event) as { search: string };
  const results = await searchAnime(search);
  if (!results || !results.media.length) throw createError({ status: 404, message: `Anime not found: '${search}'` });
  return results.media;
}, {
  swr: false,
  maxAge: 604800, // 1 week
  group: cacheGroup,
  name: cacheName,
  getKey: event => getQuery<{ search: string }>(event).search
});
