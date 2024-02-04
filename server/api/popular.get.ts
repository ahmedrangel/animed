export default defineEventHandler(async () => {
  const data = await getPopular() as Record<string, any>;
  data.type = "trending";
  return data;
});
