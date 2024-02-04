export default defineEventHandler(async () => {
  const data = await getNewlyReleased() as Record<string, any>;
  data.type = "new";
  return data;
});