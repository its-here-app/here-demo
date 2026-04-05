import { NextRequest, NextResponse } from "next/server";

/**
 * Places Text Search proxy.
 *
 * Caching strategy:
 *  - Uses raw fetch() so Next's data cache applies (`next: { revalidate }`).
 *    The @googlemaps SDK uses axios and bypasses this, so we call the REST
 *    endpoint directly.
 *  - Query is normalized (lowercase / trimmed) so equivalent searches share
 *    a cache entry.
 *  - Response has a `Cache-Control` header so the Vercel edge + browsers
 *    also cache the JSON, reducing load on the Next server itself.
 *
 * Text Search is the most expensive Places endpoint we use ($32/1k), so
 * aggressive caching here is the biggest bang for the buck.
 */

const TEXT_SEARCH_URL =
  "https://maps.googleapis.com/maps/api/place/textsearch/json";

// Cache identical searches for 24h. Restaurant/spot results change slowly.
const CACHE_TTL_SECONDS = 60 * 60 * 24;

type GooglePhoto = { photo_reference: string };
type GooglePlace = {
  place_id?: string;
  name?: string;
  formatted_address?: string;
  photos?: GooglePhoto[];
  rating?: number;
  types?: string[];
};
type TextSearchResponse = {
  results?: GooglePlace[];
  status?: string;
  error_message?: string;
};

function normalizeQuery(q: string): string {
  return q.toLowerCase().trim().replace(/\s+/g, " ");
}

export async function GET(request: NextRequest) {
  const rawQuery = request.nextUrl.searchParams.get("query");

  if (!rawQuery || rawQuery.length > 200) {
    return NextResponse.json(
      { error: "invalid query" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const query = normalizeQuery(rawQuery);
  if (query.length < 2) {
    return NextResponse.json(
      { places: [] },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.error("spots/search: GOOGLE_PLACES_API_KEY is not set");
    return NextResponse.json(
      { error: "server misconfigured" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const upstream =
      `${TEXT_SEARCH_URL}?query=${encodeURIComponent(query)}&key=${apiKey}`;

    // Use Next's fetch cache keyed on the normalized URL. Identical queries
    // from any user share the same cache entry for 24h.
    const res = await fetch(upstream, {
      next: { revalidate: CACHE_TTL_SECONDS },
    });

    if (!res.ok) {
      console.error("spots/search: upstream non-ok", res.status);
      return NextResponse.json(
        { error: "upstream error" },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    const data = (await res.json()) as TextSearchResponse;

    if (data.status && data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      // Don't log error_message (can contain sensitive details); log status only.
      console.error("spots/search: places status", data.status);
      return NextResponse.json(
        { error: "search failed" },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    // Format results. We return a stable proxy URL for photos instead of a
    // raw Google URL to avoid leaking the API key and to survive photo_reference
    // rotation (see src/app/api/spots/photo/route.ts).
    const places = (data.results ?? []).map((place) => {
      const hasPhoto = !!place.photos?.[0]?.photo_reference;
      const photo_url =
        hasPhoto && place.place_id
          ? `/api/spots/photo?place_id=${encodeURIComponent(place.place_id)}`
          : null;

      return {
        spot_id: place.place_id,
        name: place.name,
        address: place.formatted_address,
        photo_url,
        rating: place.rating ?? null,
        types: place.types ?? null,
      };
    });

    return NextResponse.json(
      { places },
      {
        headers: {
          // Cache on the edge / browser as well. s-maxage = shared cache (CDN).
          // stale-while-revalidate keeps hot queries instant while refreshing.
          "Cache-Control":
            "public, s-maxage=86400, max-age=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    // Log the error type only, not the full error (which could contain URL/key).
    console.error(
      "spots/search: fetch threw",
      error instanceof Error ? error.name : "unknown",
    );
    return NextResponse.json(
      { error: "failed to search places" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
