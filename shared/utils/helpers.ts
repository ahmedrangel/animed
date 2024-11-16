export const fixSlug = (name?: string | null) => {
  return name?.replace(/ /g, "-")?.normalize("NFD").replace(/[^a-zA-Z0-9-]/g, "")?.toLowerCase();
};
