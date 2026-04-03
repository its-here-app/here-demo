"use client";

import { useEffect, useState } from "react";
import { CardShelf } from "@/components/ui/CardShelf";
import SpotCard from "@/components/SpotCard";
import { SpotSkeletonList } from "./SpotSkeleton";
import { SpotBookmark } from "./SpotBookmark";
import { useLazyLoad, timeAgo } from "./hooks";
import { getWantedToGoSpots } from "@/lib/services/saves";
import type { Spot } from "@/types";

export function WantedToGoSection({ userId }: { userId: string }) {
  const { ref, shouldLoad } = useLazyLoad();
  const [spots, setSpots] = useState<{ spot: Spot; saved_at: string }[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!shouldLoad || loaded) return;
    getWantedToGoSpots(userId).then((s) => {
      setSpots(s);
      setLoaded(true);
    });
  }, [userId, shouldLoad, loaded]);

  return (
    <div ref={ref}>
      {loaded && spots.length === 0 ? null : (
        <CardShelf title="Wanted to go for a while">
          {!loaded ? (
            <SpotSkeletonList />
          ) : (
            <div className="flex flex-col gap-4">
              {spots.map(({ spot, saved_at }) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  subtitleText={timeAgo(saved_at)}
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
