import { NextRequest, NextResponse } from "next/server";
import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const response = await client.textSearch({
      params: {
        query,
        key: process.env.GOOGLE_PLACES_API_KEY!,
      },
    });

    // Format the results
    const places = response.data.results.map((place) => ({
      spot_id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      rating: place.rating,
      types: place.types,
      photos: place.photos?.map((photo) => photo.photo_reference),
    }));

    return NextResponse.json({ places });
  } catch (error) {
    console.error("Google Places API error:", error);
    return NextResponse.json(
      { error: "Failed to search places" },
      { status: 500 }
    );
  }
}
