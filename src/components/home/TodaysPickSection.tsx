"use client";

import { useEffect, useState } from "react";
import { CardShelf } from "@/components/ui/CardShelf";
import SpotCard from "@/components/SpotCard";
import { SpotSkeleton } from "./SpotSkeleton";
import { SpotBookmark } from "./SpotBookmark";
import { getTodaysPick } from "@/lib/services/playlists";
import type { TodaysPick } from "@/types";

export function TodaysPickSection() {
  const [pick, setPick] = useState<TodaysPick | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getTodaysPick().then((p) => {
      setPick(p);
      setLoaded(true);
    });
  }, []);

  if (loaded && !pick) return null;

  return (
    <CardShelf title="Today's pick">
      {!loaded ? (
        <SpotSkeleton />
      ) : (
        <SpotCard
          spot={pick!.spot}
          subtitleText={`From ${pick!.playlist_name} by @${pick!.username}`}
          bookmark={<SpotBookmark spot={pick!.spot} />}
        />
      )}
    </CardShelf>
  );
}
