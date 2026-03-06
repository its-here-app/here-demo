const gcs = (path: string) =>
  `https://storage.googleapis.com/${process.env.NEXT_PUBLIC_GCS_BUCKET_NAME}/${path}`;

const DEFAULT_COVER = gcs(
  "Juliettewang_portland-oregon_desserts-and-cafes_cover.jpg", // tmp
);

const CITY_COVERS: Record<string, string[]> = {
  // "new york": ["/images/covers/new-york-1.jpg"],
  // "los angeles": ["/images/covers/la-1.jpg"],
};

export function getDefaultCover(city: string): string {
  const key = city.toLowerCase().trim();
  const covers = CITY_COVERS[key];
  if (covers?.length) return covers[Math.floor(Math.random() * covers.length)];
  return DEFAULT_COVER;
}
