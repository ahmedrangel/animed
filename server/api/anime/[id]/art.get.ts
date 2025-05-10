import { load } from "cheerio";

const cacheGroup = "getAnimeInfo";
const cacheName = "art";

export default defineCachedEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const config = useRuntimeConfig();
  const title = decodeURIComponent(id).toLowerCase().replace(/\b(\d+(st|nd|rd|th)?\s+season|season\s+\d+)\b/g, "").replace(/\(\d+\)/g, "").replace(/[(),?!]/g, "").trim();
  const api = `https://www.zerochan.net/search?q=${encodeURIComponent(title)}`;
  const data = await $fetch.raw<string>(api, {
    headers: {
      "Cookie": config.zerochan.cookie,
      "User-Agent": "animed.ahmedrangel.com - Ahmed Rangel2555"
    },
    responseType: "text",
    ignoreResponseError: true
  });
  if (!data?._data) {
    event.node.res.statusCode = 404;
    event.node.res.statusMessage = "Not Found";
    throw { message: "No art found for this anime" };
  }
  const $ = load(data._data);
  const scripts = $("script[type='application/ld+json']");
  const script = scripts.map((i, el) => $(el).html()).get().find((s: string) => s.includes("itemListElement"));
  if (!script) {
    event.node.res.statusCode = 404;
    event.node.res.statusMessage = "Not Found";
    throw { message: "No art found for this anime" };
  }
  const json = JSON.parse(script);
  json.url = api;
  return json;
}, {
  maxAge: 432000, // 5 days
  swr: false,
  group: cacheGroup,
  name: cacheName,
  getKey: event => getRouterParams(event).id as string
});
