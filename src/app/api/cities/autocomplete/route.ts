import { NextRequest, NextResponse } from "next/server";
import { Client, PlaceAutocompleteType } from "@googlemaps/google-maps-services-js";

const client = new Client({});

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("query");
    if (!query || query.length < 2) {
      return NextResponse.json({ cities: [] });
    }

    const response = await client.placeAutocomplete({
      params: {
        input: query,
        types: PlaceAutocompleteType.cities,
        key: process.env.GOOGLE_PLACES_API_KEY!,
      },
    });

    const cities = response.data.predictions.map((p) => {
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

    return NextResponse.json({ cities });
  } catch (error) {
    console.error("City autocomplete error:", error);
    return NextResponse.json(
      { error: "Failed to search cities" },
      { status: 500 },
    );
  }
}
