export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const { data } = await getAnimeInfo(Number(id)) ;
  return data.Media;
});