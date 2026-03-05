// Default cover used when a playlist is first created.
// Drop your stock image at public/images/playlist-default.jpg
// TODO: expand CITY_COVERS with arrays of images per city and rotate through them.
const DEFAULT_COVER = "/images/playlist-default.jpg";

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
