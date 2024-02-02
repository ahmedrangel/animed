export default defineEventHandler(async () => {
  const data = await getTopRated();
  return data;
});