export default defineEventHandler(async (event) => {
  const { token } = getQuery(event) as Token;
  const data = await getSimulcasts(token);
  return data;
});