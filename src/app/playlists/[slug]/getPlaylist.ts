import { createClient } from "@/lib/supabase/server";

export async function getPlaylist(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("playlists")
    .select(
      `
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
    `,
    )
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data;
}
