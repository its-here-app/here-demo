import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPlaylist } from "@/app/playlists/[slug]/getPlaylist";
import PlaylistOverlay from "@/app/playlists/[slug]/PlaylistOverlay";

export default async function PlaylistModal({
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

  if (!playlist) notFound();

  const isOwner = user?.id === playlist.user_id;

  if (!playlist.is_public && !isOwner) notFound();

  return (
    <PlaylistOverlay playlist={playlist} isOwner={isOwner} fromNew={from === "new"} />
  );
}
