import { NextRequest, NextResponse } from "next/server";

/**
 * Place Autocomplete proxy for city selection.
 *
 * Caching strategy:
 *  - Raw fetch() so Next's data cache applies. The @googlemaps SDK uses
 *    axios and bypasses this.
 *  - Queries are normalized so equivalent prefixes share a cache entry.
 *  - City lists change extremely slowly, so we cache aggressively (7 days).
 *  - Client-side this route is already debounced at 300ms.
 */

const AUTOCOMPLETE_URL =
  "https://maps.googleapis.com/maps/api/place/autocomplete/json";

// Cache autocomplete prefixes for 7 days. City lists are effectively static.
const CACHE_TTL_SECONDS = 60 * 60 * 24 * 7;

type AutocompleteTerm = { value: string };
type AutocompletePrediction = {
  place_id?: string;
  description?: string;
  terms?: AutocompleteTerm[];
};
type AutocompleteResponse = {
  predictions?: AutocompletePrediction[];
  status?: string;
};

function normalizeQuery(q: string): string {
  return q.toLowerCase().trim().replace(/\s+/g, " ");
}

export async function GET(request: NextRequest) {
  const rawQuery = request.nextUrl.searchParams.get("query");

  if (!rawQuery || rawQuery.length > 200) {
    return NextResponse.json(
      { cities: [] },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const query = normalizeQuery(rawQuery);
  if (query.length < 2) {
    return NextResponse.json(
      { cities: [] },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.error("cities/autocomplete: GOOGLE_PLACES_API_KEY is not set");
    return NextResponse.json(
      { error: "server misconfigured" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const upstream =
      `${AUTOCOMPLETE_URL}` +
      `?input=${encodeURIComponent(query)}` +
      `&types=(cities)` +
      `&key=${apiKey}`;

    const res = await fetch(upstream, {
      next: { revalidate: CACHE_TTL_SECONDS },
    });

    if (!res.ok) {
      console.error("cities/autocomplete: upstream non-ok", res.status);
      return NextResponse.json(
        { error: "upstream error" },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    const data = (await res.json()) as AutocompleteResponse;

    if (data.status && data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("cities/autocomplete: places status", data.status);
      return NextResponse.json(
        { error: "search failed" },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    const cities = (data.predictions ?? []).map((p) => {
      const terms = p.terms ?? [];
      const lastTerm = terms[terms.length - 1]?.value;
      // Strip country for US cities
      const display_name =
        lastTerm === "USA"
          ? terms
              .slice(0, -1)
              .map((t) => t.value)
              .join(", ")
          : p.description;

      return {
        google_place_id: p.place_id,
        display_name,
      };
    });

    return NextResponse.json(
      { cities },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=604800, max-age=86400, stale-while-revalidate=604800",
        },
      },
    );
  } catch (error) {
    console.error(
      "cities/autocomplete: fetch threw",
      error instanceof Error ? error.name : "unknown",
    );
    return NextResponse.json(
      { error: "failed to search cities" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
