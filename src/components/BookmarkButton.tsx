"use client";

import { useState, useEffect } from "react";
import { useSaves } from "@/lib/savesContext";
import { useAuth } from "@/lib/authContext";
import { isPlaylistSaved, savePlaylist, unsavePlaylist } from "@/lib/services/saves";
import type { DraftSpot } from "@/types";
import { IconButton } from "@/components/ui/IconButton";
import { Bookmark } from "@/components/ui/icons/Bookmark";

type SpotProps = { spot: DraftSpot; playlistId?: never };
type PlaylistProps = { playlistId: string; spot?: never };

export default function BookmarkButton({ spot, playlistId }: SpotProps | PlaylistProps) {
  const { isSaved, toggle } = useSaves();
  const { user } = useAuth();
  const [playlistSaved, setPlaylistSaved] = useState(false);
  const [loading, setLoading] = useState(!!playlistId);

  useEffect(() => {
    if (!playlistId || !user) { setLoading(false); return; }
    isPlaylistSaved(user.id, playlistId).then((v) => {
      setPlaylistSaved(v);
      setLoading(false);
    });
  }, [user, playlistId]);

  async function togglePlaylist() {
    if (!user || loading || !playlistId) return;
    setPlaylistSaved((prev) => !prev);
    try {
      if (playlistSaved) await unsavePlaylist(user.id, playlistId);
      else await savePlaylist(user.id, playlistId);
    } catch {
      setPlaylistSaved((prev) => !prev);
    }
  }

  if (playlistId) {
    if (!user || loading) return null;
    return (
      <IconButton
        variant="secondary"
        icon={<Bookmark active={playlistSaved} />}
        label={playlistSaved ? "Remove from saves" : "Save playlist"}
        onClick={togglePlaylist}
      />
    );
  }

  const saved = isSaved(spot!.google_place_id);
  return (
    <IconButton
      variant="secondary"
      icon={<Bookmark active={saved} />}
      label={saved ? "Remove from saves" : "Save spot"}
      onClick={() => toggle(spot!)}
    />
  );
}
