import { createClient } from "@/lib/supabase/server";
import { toSlug } from "@/lib/playlistUrl";
import type { Playlist } from "@/types";

export async function getPlaylistsByUser(
  userId: string,
  onlyPublic = false
): Promise<Playlist[]> {
  const supabase = await createClient();
  let query = supabase
    .from("playlists")
    .select("*, playlist_spots(count)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (onlyPublic) query = query.eq("is_public", true);
  const { data, error } = await query;
  if (error) return [];
  return data.map((p: any) => ({
    ...p,
    spot_count: p.playlist_spots?.[0]?.count ?? 0,
    playlist_spots: undefined,
  }));
}

const PLAYLIST_SELECT = `
  *,
  profiles!playlists_user_id_fkey (
    username,
    full_name,
    avatar_url
  ),
  playlist_spots (
    id,
    notes,
    created_at,
    spots (
      id,
      google_place_id,
      name,
      address,
      photo_url,
      rating,
      types
    )
  )
`;

export async function getPlaylistByUsernameAndName(
  username: string,
  nameSlug: string
) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .single();

  if (!profile) return null;

  const { data, error } = await supabase
    .from("playlists")
    .select(PLAYLIST_SELECT)
    .eq("user_id", profile.id);

  if (error || !data) return null;

  return data.find((p: any) => toSlug(p.name) === nameSlug) ?? null;
}
