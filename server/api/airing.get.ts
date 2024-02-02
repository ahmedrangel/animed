export default defineEventHandler(async () => {
  const data = await getTopAiring();
  return data;
});