export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const { data } = await getAnimeEpisodes({ id: Number(id) }) ;
  return data.Media;
});