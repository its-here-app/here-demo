const gcs = (path: string) =>
  `https://storage.googleapis.com/${process.env.NEXT_PUBLIC_GCS_BUCKET_NAME}/${path}`;

/* ------------------------------------------------------------------ */
/*  Cover photo inventory — all files in gs://here-app/default-covers */
/* ------------------------------------------------------------------ */

const COVERS = [
  "los-angeles_generic-hike_griffith-park.png",
  "generic_dinner_los-angeles.png",
  "new-york_china-town_manhattan.png",
  "new-york_generic.png",
  "san-francisco_generic_fish-market.png",
  "san-francisco_generic_dolores-park.png",
  "steph.kotula_utah_hiking-nature_cover.png",
  "new-york_williamsburg_generic.png",
  "maisieleung_los-angeles_ktown-faves_cover.png",
  "new-york_brooklyn_dumbo.png",
  "new-york_catskills_upstate_wine_bonfire.png",
  "new-york_downtown-brooklyn_generic-city.png",
  "wenju.tseng_London_bestmuseums_cover.png",
  "new-york_les_generic-dessert.png",
  "new-york_williamsburg_generic_domino-park.png",
  "new-york_generic_2.png",
  "jessicastrelioff_austin_a-perfect-day_cover.png",
  "los-angeles_generic_palmtrees.png",
  "weiweiyang_ho-chi-minh-city_best-restaurants-in-town_cover.png",
  "los-angeles_generic_japan-town.png",
  "new-york_generic-forest-hike_catskills.png",
  "new-york_generic_5.png",
  "portland_maine_generic.png",
  "los-angeles_venice-canals.png",
  "mexico_generic.png",
  "new-york_empire-state.png",
  "new-york_generic_4.png",
  "new-york_generic_asian-food.png",
  "new-york_generic-brunch.png",
  "portland_oregon_generic-park_generic.png",
  "san-francisco_generic_twin-peaks.png",
  "los-angeles_larchmont_generic-market_fruits.png",
  "san-francisco_generic.png",
  "new-york_generic_3.png",
  "new-york_generic_greek_brooklyn.png",
  "new-york_generic_wine.png",
  "new-york_west-village_cafe-tola.png",
  "japan_generic-asia.png",
  "los-angeles_robata_generic-sushi.png",
  "new-york_manhattan_oculus.png",
] as const;

const COVER_URLS = COVERS.map((f) => gcs(`default-covers/${f}`));

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** "New York" → "new-york", "Ho Chi Minh City" → "ho-chi-minh-city" */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, " ") // strip punctuation (commas, periods, etc)
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Normalize a city string for matching. Drops any state/country suffix after
 * a comma so "New York, NY" → "new-york", "Portland, OR" → "portland".
 */
function normalizeCity(city: string): string {
  const primary = city.split(",")[0];
  return normalize(primary);
}

/** Pull meaningful keywords from a playlist name, ignoring short/common words. */
const STOP_WORDS = new Set([
  "a", "an", "the", "my", "our", "your", "in", "of", "and", "to", "for",
  "at", "on", "is", "it", "best", "top", "fave", "faves", "favorite",
  "favorites", "favourite", "favourites", "guide", "list", "perfect", "day",
]);

/** Crude stemmer so "hikes"/"hike", "bakeries"/"bakery" match the same cover. */
function stem(w: string): string {
  if (w.length > 4 && w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.length > 4 && w.endsWith("es")) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith("s")) return w.slice(0, -1);
  return w;
}

function extractKeywords(name: string): string[] {
  return normalize(name)
    .split(/[-_\s]+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
    .map(stem);
}

/** Tokenize a cover filename into stemmed word-ish parts for keyword matching. */
function fileTokens(filename: string): string[] {
  return filename
    .replace(/\.[a-z]+$/i, "")
    .split(/[-_]+/)
    .filter((w) => w.length > 2)
    .map(stem);
}

function fileMatchesKeyword(tokens: string[], keyword: string): boolean {
  return tokens.some(
    (t) => t === keyword || t.includes(keyword) || keyword.includes(t),
  );
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

/**
 * Pick a default cover photo for a playlist.
 *
 * Fallback tiers (from Obsidian spec):
 *  1. City match — filename contains the playlist's city
 *  2. Generic + keyword — "generic" filename matching a keyword in the playlist name
 *  3. Pure generic — any filename containing "generic"
 *  4. Ultimate fallback — any cover at all
 */
export function getDefaultCover(city: string, playlistName?: string): string {
  const cityKey = normalizeCity(city);
  const lowered = COVERS.map((f) => f.toLowerCase());
  const tokenized = lowered.map(fileTokens);

  // Tier 1: city match
  const cityIndices = lowered.reduce<number[]>((acc, f, i) => {
    if (f.includes(cityKey)) acc.push(i);
    return acc;
  }, []);

  if (cityIndices.length) {
    // Within city matches, try keyword refinement
    if (playlistName) {
      const keywords = extractKeywords(playlistName);
      const refined = cityIndices.filter((i) =>
        keywords.some((k) => fileMatchesKeyword(tokenized[i], k)),
      );
      if (refined.length) return COVER_URLS[randomPick(refined)];
    }
    return COVER_URLS[randomPick(cityIndices)];
  }

  // A file is "city-agnostic" when its first underscore segment is "generic".
  // This avoids picking e.g. `new-york_generic_wine.png` as a fallback for
  // a city with no match.
  const isPureGeneric = (f: string) => f.split("_")[0] === "generic";

  // Tier 2: generic + keyword from playlist name
  if (playlistName) {
    const keywords = extractKeywords(playlistName);
    const genericKeyword = lowered.reduce<number[]>((acc, f, i) => {
      if (
        isPureGeneric(f) &&
        keywords.some((k) => fileMatchesKeyword(tokenized[i], k))
      ) {
        acc.push(i);
      }
      return acc;
    }, []);
    if (genericKeyword.length) return COVER_URLS[randomPick(genericKeyword)];
  }

  // Tier 3: pure generic (filename starts with "generic_")
  const generics = lowered.reduce<number[]>((acc, f, i) => {
    if (isPureGeneric(f)) acc.push(i);
    return acc;
  }, []);
  if (generics.length) return COVER_URLS[randomPick(generics)];

  // Tier 4: anything
  return randomPick(COVER_URLS);
}
