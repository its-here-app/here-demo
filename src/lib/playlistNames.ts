export const PLAYLIST_NAMES = [
  "All time faves",
  "Best of the city",
  "Hidden gems",
  "On repeat",
  "Neighborhood classics",
  "City staples",
  "Forever faves",
  "Must tries",
  "Tried & true",
];

export function randomPlaylistName(): string {
  return PLAYLIST_NAMES[Math.floor(Math.random() * PLAYLIST_NAMES.length)];
}
