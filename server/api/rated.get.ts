export default defineEventHandler(async (event) => {
  const data = await getTopRated();
  return data;
});