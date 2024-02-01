export const getRating = (rating: number) => {
  const percentage = (rating / 5) * 100;
  const remain = (100 - percentage).toFixed(2);
  return remain;
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