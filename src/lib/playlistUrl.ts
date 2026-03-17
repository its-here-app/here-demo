export function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function playlistUrl(username: string, city: string, name: string): string {
  return `/${username}/${toSlug(city)}/${toSlug(name)}`;
}
