"use client";

import { useState, useEffect, useRef } from "react";
import { useSaves } from "@/lib/savesContext";
import { useAuth } from "@/lib/authContext";
import { isPlaylistSaved, savePlaylist, unsavePlaylist } from "@/lib/services/saves";
import type { DraftSpot } from "@/types";
import { IconButton } from "@/components/ui/IconButton";
import type { IconButtonVariant } from "@/components/ui/IconButton";
import { Bookmark } from "@/components/ui/icons/Bookmark";

type SpotProps = { spot: DraftSpot; playlistId?: never; variant?: IconButtonVariant; onRemove?: () => void };
type PlaylistProps = { playlistId: string; spot?: never; variant?: IconButtonVariant; onRemove?: never };

export default function BookmarkButton({ spot, playlistId, variant = "ghost", onRemove }: SpotProps | PlaylistProps) {
  const { isSaved, toggle } = useSaves();
  const { user } = useAuth();
  const [playlistSaved, setPlaylistSaved] = useState(false);
  const [loading, setLoading] = useState(!!playlistId);
  const [animating, setAnimating] = useState(false);
  const prevActiveRef = useRef(false);

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

  const saved = playlistId ? playlistSaved : isSaved(spot!.google_place_id);

  useEffect(() => {
    if (saved && !prevActiveRef.current) setAnimating(true);
    prevActiveRef.current = saved;
  }, [saved]);

  const icon = (
    <span
      className={animating ? "animate-bookmark-pop" : ""}
      onAnimationEnd={() => setAnimating(false)}
    >
      <Bookmark active={saved} />
    </span>
  );

  if (playlistId) {
    if (!user || loading) return null;
    return (
      <IconButton
        variant={variant}
        icon={icon}
        label={saved ? "Remove from saves" : "Save playlist"}
        onClick={togglePlaylist}
      />
    );
  }

  return (
    <IconButton
      variant={variant}
      icon={icon}
      label={saved ? "Remove from saves" : "Save spot"}
      onClick={() => (saved && onRemove) ? onRemove() : toggle(spot!)}
    />
  );
}
