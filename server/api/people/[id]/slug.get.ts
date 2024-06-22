export default defineCachedEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const data = await getStaffSlug(Number(id));
  const slug = fixSlug(data.Staff.name.userPreferred);
  const obj = { id, slug };

  const response = obj;

  if (response) return response;
}, { maxAge: !import.meta.dev ? 604800 : 0 }); // 1w cache
