import { createClient } from "../supabase/client";
import { track } from "../analytics";
import { getDefaultCover } from "../playlist-covers";
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

export async function getPlaylistsByUser(
  userId: string,
  onlyPublic = false
): Promise<Playlist[]> {
  const supabase = createClient();
  let query = supabase
    .from("playlists")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (onlyPublic) query = query.eq("is_public", true);
  const { data, error } = await query;
  if (error) return [];
  return data;
}

export async function upsertSpot(spot: {
  google_place_id: string;
  name: string;
  address: string;
  photo_url?: string | null;
  rating?: number | null;
  types?: string[] | null;
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
  position: number,
  userId: string
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("playlist_spots")
    .insert({ playlist_id: playlistId, spot_id: spotId, position })
    .select("id, notes, position")
    .single();
  if (error) throw error;
  track(userId, "spot.added_to_playlist", { playlist_id: playlistId, spot_id: spotId });
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
    .insert({ ...params, cover_photo_url: getDefaultCover(params.city) })
    .select()
    .single();
  if (error) throw error;
  track(params.user_id, "playlist.created", {
    playlist_id: data.id,
    city: params.city,
    is_public: params.is_public,
  });
  return data;
}

export async function updatePlaylistDescription(
  playlistId: string,
  description: string
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("playlists")
    .update({ description })
    .eq("id", playlistId);
  if (error) throw error;
}

export async function updateSpotNotes(playlistSpotId: string, notes: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("playlist_spots")
    .update({ notes })
    .eq("id", playlistSpotId);
  if (error) throw error;
}

export async function uploadPlaylistCover(
  playlistId: string,
  userId: string,
  file: File,
  currentUrl?: string | null
): Promise<string> {
  const supabase = createClient();

  // Remove old file from storage if it was a user upload (not a local default)
  if (currentUrl && currentUrl.startsWith("http")) {
    const storagePath = currentUrl.split("/playlist-covers/")[1];
    if (storagePath) {
      await supabase.storage.from("playlist-covers").remove([storagePath]);
    }
  }

  const fileExt = file.name.split(".").pop();
  // Path format: {userId}/{playlistId}-{timestamp}.{ext}
  // Putting userId first lets the storage policy check ownership without a table lookup
  const fileName = `${userId}/${playlistId}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("playlist-covers")
    .upload(fileName, file);
  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("playlist-covers").getPublicUrl(fileName);

  await supabase
    .from("playlists")
    .update({ cover_photo_url: publicUrl })
    .eq("id", playlistId);

  return publicUrl;
}

export async function deletePlaylist(playlistId: string, userId: string) {
  const supabase = createClient();
  // Remove spots first in case cascade isn't configured
  await supabase.from("playlist_spots").delete().eq("playlist_id", playlistId);
  const { error } = await supabase
    .from("playlists")
    .delete()
    .eq("id", playlistId);
  if (error) throw error;
  track(userId, "playlist.deleted", { playlist_id: playlistId });
}
