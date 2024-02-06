import { format } from "date-fns";

export const getRating = (percent: number) => {
  const stars = (percent / 100) * 10;
  const format = Math.round(stars * 10) / 10;
  return format;
};

export const formatRating = (rating: number) => {
  if (rating >= 1000000) {
    return (rating / 1000000).toFixed(2) + "m";
  }
  else if (rating >= 1000) {
    return (rating / 1000).toFixed(1) + "k";
  }
  return rating.toString();
};

export const onScreen = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  return (rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth);
};

export const fixSlug = (name: string) => {
  return name?.replace(/ /g, "-")?.replace(/[^a-zA-Z0-9-]/g, "")?.toLowerCase();
};

export const formatDate = (y?: string, m?: string, d?: string) => {
  if (m && y && d) {
    return format(new Date(y, m - 1, d), "MMM d, yyyy");
  }
  else if (!d && m && y) {
    return format(new Date(y, m - 1), "MMM yyyy");
  }
  else if (!d && !m && y) {
    return format(new Date(y), "yyyy");
  }
};

export const getStudios = (studios: Record<string, any>) => {
  return studios.edges.filter(edge => edge.isMain === true).map(edge => edge.node.name).join(", ");
};

export const getProducers = (studios: Record<string, any>) => {
  return studios.edges.filter(edge => edge.isMain === false).map(edge => edge.node.name).join(", ");
};