import { createClient } from "../supabase/client";
import { upsertSpot } from "./playlists";
import { track } from "../analytics";
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

  track(userId, "spot.saved", { spot_id: spot.id, name: spot.name });
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
  track(userId, "spot.unsaved", { spot_id: spotId });
}

export interface SavedPlaylist {
  id: number;
  playlist_id: string;
  playlist: {
    id: string;
    name: string;
    city: string;
    slug: string;
    cover_photo_url: string | null;
    spot_count: number;
    profiles: { username: string; full_name: string };
  };
}

export async function getSavedPlaylists(userId: string): Promise<SavedPlaylist[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("saved_playlists")
    .select(`
      id,
      playlist_id,
      playlists!saved_playlists_playlist_id_fkey (
        id, name, city, slug, cover_photo_url,
        profiles!playlists_user_id_fkey (username, full_name),
        playlist_spots (id)
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];

  return data.map((row: any) => ({
    id: row.id,
    playlist_id: row.playlist_id,
    playlist: {
      ...row.playlists,
      spot_count: row.playlists.playlist_spots?.length ?? 0,
    },
  }));
}

export async function isPlaylistSaved(
  userId: string,
  playlistId: string
): Promise<boolean> {
  const supabase = createClient();
  const { data } = await supabase
    .from("saved_playlists")
    .select("id")
    .eq("user_id", userId)
    .eq("playlist_id", playlistId)
    .maybeSingle();
  return !!data;
}

export async function savePlaylist(
  userId: string,
  playlistId: string
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("saved_playlists")
    .insert({ user_id: userId, playlist_id: playlistId });
  if (error) throw error;
  track(userId, "playlist.saved", { playlist_id: playlistId });
}

export async function unsavePlaylist(
  userId: string,
  playlistId: string
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("saved_playlists")
    .delete()
    .eq("user_id", userId)
    .eq("playlist_id", playlistId);
  if (error) throw error;
  track(userId, "playlist.unsaved", { playlist_id: playlistId });
}
