import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PlaylistOverlay from "./PlaylistOverlay";
import { getPlaylist } from "./getPlaylist";
import { playlistDocTitle } from "@/lib/playlistDocTitle";

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
    title: playlistDocTitle(playlist.city, playlist.name, username),
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
    <PlaylistOverlay playlist={playlist} isOwner={isOwner} fromNew={from === "new"} />
  );
}
