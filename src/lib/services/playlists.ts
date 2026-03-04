import { createClient } from "../supabase/client";
import type { Playlist, SearchResult } from "@/types";

export async function searchSpots(
  query: string,
  city?: string
): Promise<SearchResult[]> {
  const q = city ? `${query}, ${city}` : query;
  const response = await fetch(
    `/api/spots/search?query=${encodeURIComponent(q)}`
  );
  if (!response.ok) throw new Error("Failed to search spots");
  const data = await response.json();
  return data.places ?? [];
}

export async function getPlaylistsByUser(userId: string): Promise<Playlist[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data;
}

export async function upsertSpot(spot: {
  google_place_id: string;
  name: string;
  address: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("spots")
    .upsert(spot, { onConflict: "google_place_id" })
    .select("id, google_place_id, name, address")
    .single();
  if (error) throw error;
  return data;
}

export async function addSpotToPlaylist(
  playlistId: string,
  spotId: string,
  position: number
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("playlist_spots")
    .insert({ playlist_id: playlistId, spot_id: spotId, position })
    .select("id, notes, position")
    .single();
  if (error) throw error;
  return data;
}

export async function removeSpotFromPlaylist(playlistSpotId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("playlist_spots")
    .delete()
    .eq("id", playlistSpotId);
  if (error) throw error;
}

export async function reorderPlaylistSpots(
  reordered: { id: string; position: number }[]
) {
  const supabase = createClient();
  await Promise.all(
    reordered.map(({ id, position }) =>
      supabase.from("playlist_spots").update({ position }).eq("id", id)
    )
  );
}

export async function createPlaylist(params: {
  user_id: string;
  name: string;
  city: string;
  slug: string;
  description: string;
  is_public: boolean;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("playlists")
    .insert(params)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePlaylist(playlistId: string) {
  const supabase = createClient();
  // Remove spots first in case cascade isn't configured
  await supabase.from("playlist_spots").delete().eq("playlist_id", playlistId);
  const { error } = await supabase
    .from("playlists")
    .delete()
    .eq("id", playlistId);
  if (error) throw error;
}
