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
  return name.replace(/ /g, "-").replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();
};

export const formatDate = (date: string) => {
  return format(new Date(date), "MMM d, yyyy");
};