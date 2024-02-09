export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const { data } = await getAnimeCharacters({ id: Number(id) }) ;
  return data.Media;
});