export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const data = await getAnimeSlug(Number(id));
  const slug = fixSlug(data.Media.title.romaji);
  return { id, slug };
});