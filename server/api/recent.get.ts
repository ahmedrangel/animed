export default defineEventHandler(async () => {
  const data = await getRecentlyAdded();
  return data;
});