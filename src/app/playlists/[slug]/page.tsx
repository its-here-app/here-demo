import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const playlist = await getPlaylist(slug);
  if (!playlist) return {};

  const username = playlist.profiles?.username;
  return {
    title: `${playlist.city} — ${playlist.description} @${username} • Here*`,
  };
}

export default async function PlaylistPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const [{ slug }, { from }] = await Promise.all([params, searchParams]);
  const supabase = await createClient();

  const [
    playlist,
    {
      data: { user },
    },
  ] = await Promise.all([getPlaylist(slug), supabase.auth.getUser()]);

  if (!playlist) {
    notFound();
  }

  const isOwner = user?.id === playlist.user_id;

  if (!playlist.is_public && !isOwner) {
    notFound();
  }

  return (
    <main>
      <PlaylistEditor playlist={playlist} isOwner={isOwner} fromNew={from === "new"} />
    </main>
  );
}
