export const getRating = (percent: number) => {
  const stars = (percent / 100) * 5;
  return stars.toFixed(1);
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