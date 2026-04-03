"use client";

import { useEffect, useState } from "react";
import { CardShelf } from "@/components/ui/CardShelf";
import SpotCard from "@/components/SpotCard";
import { SpotSkeletonList } from "./SpotSkeleton";
import { SpotBookmark } from "./SpotBookmark";
import { useLazyLoad } from "./hooks";
import { getOldFavoriteSpots } from "@/lib/services/saves";
import type { Spot } from "@/types";

export function OldFavoritesSection({ userId }: { userId: string }) {
  const { ref, shouldLoad } = useLazyLoad();
  const [favorites, setFavorites] = useState<
    { spot: Spot; playlist_name: string }[]
  >([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!shouldLoad || loaded) return;
    getOldFavoriteSpots(userId).then((s) => {
      setFavorites(s);
      setLoaded(true);
    });
  }, [userId, shouldLoad, loaded]);

  return (
    <div ref={ref}>
      {loaded && favorites.length === 0 ? null : (
        <CardShelf title="Revisit your old favorites">
          {!loaded ? (
            <SpotSkeletonList />
          ) : (
            <div className="flex flex-col gap-4">
              {favorites.map(({ spot, playlist_name }) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  subtitleText={`In your ${playlist_name} playlist`}
                  bookmark={<SpotBookmark spot={spot} />}
                />
              ))}
            </div>
          )}
        </CardShelf>
      )}
    </div>
  );
}
