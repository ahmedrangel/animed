export default defineEventHandler(async () => {
  const data = await getNewlyReleased();
  return data;
});