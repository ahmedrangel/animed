export default defineCachedEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const data = await getAnimeSlug(Number(id));
  const slug = fixSlug(data.title.romaji);
  const obj = { id, slug };

  const response = obj;

  if (response) return response;
}, { maxAge: !import.meta.dev ? 604800 : 1 }); // 1w cache
