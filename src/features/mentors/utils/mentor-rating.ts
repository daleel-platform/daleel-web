export interface PlaceholderRating {
  rating: string;
  reviewCount: number;
}

/** Temporary deterministic placeholder until real mentor ratings are implemented. */
export function getPlaceholderRating(mentorId: string): PlaceholderRating {
  const seed = mentorId
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const rating = (4.7 + (seed % 4) * 0.1).toFixed(1);
  const reviewCount = 12 + (seed % 37);
  return { rating, reviewCount };
}
