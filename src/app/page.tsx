"use client";

import { useEffect, useState } from "react";
import { AppBarConfig } from "@/lib/appBarContext";
import { FullLogo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Map } from "@/components/ui/icons/Map";
import { CardShelf } from "@/components/ui/CardShelf";
import { PlaylistCard } from "@/components/PlaylistCard";
import { useAuth } from "@/lib/authContext";
import { getPlaylistsByUser } from "@/lib/services/playlists";
import { getUserUsername } from "@/lib/services/users";
import { playlistUrl } from "@/lib/playlistUrl";
import type { Playlist } from "@/types";

export default function HomePage() {
  const { user } = useAuth();
  const [latestPlaylist, setLatestPlaylist] = useState<Playlist | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getUserUsername(user.id).then(setUsername);
    getPlaylistsByUser(user.id).then((playlists) => {
      setLatestPlaylist(playlists[0] ?? null);
    });
  }, [user]);

  return (
    <>
      <AppBarConfig
        left={<FullLogo />}
        right={
          <Button variant="tonal" size="sm" leftIcon={<Map />}>
            Los Angeles
          </Button>
        }
      />
      <div className="flex flex-col gap-12">
        <CardShelf title="Your playlists">
          {latestPlaylist && username && (
            <PlaylistCard
              size="xs"
              city={latestPlaylist.city}
              name={latestPlaylist.name}
              subtitle={latestPlaylist.description ?? undefined}
              image={latestPlaylist.cover_photo_url ?? undefined}
              href={playlistUrl(username, latestPlaylist.city, latestPlaylist.name)}
            />
          )}
        </CardShelf>
        <CardShelf title="Shared by friends" />
        <CardShelf title="Today's most saved" />
      </div>
    </>
  );
}
