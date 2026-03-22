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
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let raf2: number;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setIsAnimating(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  useEffect(() => {
    const prev = document.title;
    const description = playlist.description
      ? ` — ${playlist.description}`
      : "";
    document.title = `${playlist.city}${description} @${playlist.profiles.username} • Here*`;
    return () => {
      document.title = prev;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function dismiss(pushTo?: string) {
    setClosing(true);
    setTimeout(() => {
      if (pushTo) {
        router.push(pushTo);
      } else if (fromNew) {
        router.push(`/${playlist.profiles.username}`);
      } else {
        router.back();
      }
    }, 400);
  }

  return (
    <main
      className={`fixed inset-0 z-50 bg-surface-base overflow-y-auto p-[var(--space-page-sm)] lg:pb-0 max-w-[var(--app-max-width)] mx-auto transition-transform ease-in-out duration-400 ${closing || !isAnimating ? "translate-x-full" : "translate-x-0"} ${closing ? "pointer-events-none" : ""}`}
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
