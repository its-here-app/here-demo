"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PlaylistEditor from "./PlaylistEditor";

interface Props {
  playlist: any;
  isOwner: boolean;
  fromNew?: boolean;
}

export default function PlaylistOverlay({ playlist, isOwner, fromNew }: Props) {
  const router = useRouter();
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const prev = document.title;
    const description = playlist.description ? ` — ${playlist.description}` : "";
    document.title = `${playlist.city}${description} @${playlist.profiles.username} • Here*`;
    return () => { document.title = prev; };
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function dismiss() {
    setClosing(true);
    setTimeout(() => {
      if (fromNew) {
        router.push(`/${playlist.profiles.username}`);
      } else {
        router.back();
      }
    }, 250);
  }

  return (
    <main
      className="fixed inset-0 z-50 bg-white overflow-y-auto p-[var(--space-page-sm)] lg:pb-0"
      style={{ animation: `${closing ? "fadeOut" : "fadeIn"} 250ms ease forwards` }}
    >
      <PlaylistEditor
        playlist={playlist}
        isOwner={isOwner}
        fromNew={fromNew}
        onClose={dismiss}
      />
    </main>
  );
}
