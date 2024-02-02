export default defineEventHandler(async (event) => {
  const { slug } = getRouterParams(event);
  const data = await getAnimeInfo(slug);
  return data;
});