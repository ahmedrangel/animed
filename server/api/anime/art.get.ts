import { load } from "cheerio";

const cacheGroup = "getAnimeInfo";
const cacheName = "art";

export default defineCachedEventHandler(async (event) => {
  const { search } = getQuery<{ search: string }>(event);
  const title = search.toLowerCase().replace(/\b(\d+(st|nd|rd|th)?\s+season|season\s+\d+)\b/g, "").replace(/\(\d+\)/g, "").replace(/[(),?!]/g, "").trim();
  const api = `https://www.zerochan.net/search?q=${encodeURIComponent(title)}`;
  const data = await $fetch.raw<string>(api, {
    headers: {
      "User-Agent": "animed.ahmedrangel.com - Ahmed Rangel2555"
    },
    responseType: "text",
    ignoreResponseError: true
  });
  if (!data?._data) {
    throw createError({
      status: 404,
      message: "No art found for this anime"
    });
  }
  const $ = load(data._data);
  const scripts = $("script[type='application/ld+json']");
  const script = scripts.map((i, el) => $(el).html()).get().find((s: string) => s.includes("itemListElement"));
  if (!script) {
    throw createError({
      status: 404,
      message: "No art found for this anime"
    });
  }
  const json = JSON.parse(script);
  json.url = api;
  return json;
}, {
  maxAge: 432000, // 5 days
  swr: false,
  group: cacheGroup,
  name: cacheName,
  getKey: event => getQuery<{ search: string }>(event).search
});
