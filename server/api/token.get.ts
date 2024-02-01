export default defineEventHandler(async () => {
  const data = await getToken();
  return data;
});
