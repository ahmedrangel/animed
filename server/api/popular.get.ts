export default defineEventHandler(async (event) => {
  const { token }: Token = getQuery(event);
  const data = await getPopular(token);
  return data;
});
