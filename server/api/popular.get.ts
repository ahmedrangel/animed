export default defineEventHandler(async () => {
  const data = await getPopular();
  return data;
});
