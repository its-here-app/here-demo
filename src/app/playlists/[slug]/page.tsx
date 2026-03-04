import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PlaylistEditor from "./PlaylistEditor";

async function getPlaylist(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("playlists")
    .select(
      `
      *,
      profiles!playlists_user_id_fkey (
        username,
        full_name
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

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const [playlist, { data: { user } }] = await Promise.all([
    getPlaylist(slug),
    supabase.auth.getUser(),
  ]);

  if (!playlist) {
    notFound();
  }

  const isOwner = user?.id === playlist.user_id;

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <PlaylistEditor playlist={playlist} isOwner={isOwner} />
    </main>
  );
}
