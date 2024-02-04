export default defineEventHandler(async () => {
  const data = await getTopRated() as Record<string, any>;
  data.type = "top-rated";
  return data;
});