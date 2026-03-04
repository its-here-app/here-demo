import { createClient } from "../supabase/client";
import { upsertSpot } from "./playlists";
import type { Spot, SearchResult } from "@/types";

export async function getSavedSpots(userId: string): Promise<Spot[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("saved_spots")
    .select("spots (*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []).map((row: any) => row.spots);
}

export async function saveSpot(
  userId: string,
  place: SearchResult
): Promise<Spot> {
  const spot = await upsertSpot({
    google_place_id: place.spot_id,
    name: place.name,
    address: place.address,
    photo_url: place.photo_url,
    rating: place.rating,
    types: place.types,
  });

  const supabase = createClient();
  const { error } = await supabase
    .from("saved_spots")
    .insert({ user_id: userId, spot_id: spot.id });
  if (error) throw error;

  return spot;
}

export async function unsaveSpot(
  userId: string,
  spotId: string
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("saved_spots")
    .delete()
    .eq("user_id", userId)
    .eq("spot_id", spotId);
  if (error) throw error;
}
