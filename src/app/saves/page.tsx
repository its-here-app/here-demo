"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { useSaves } from "@/lib/savesContext";
import SpotCard from "@/components/SpotCard";
import BookmarkButton from "@/components/BookmarkButton";
import SpotSearchInput from "@/components/SpotSearchInput";

export default function SavesPage() {
  const { user, loading: authLoading } = useAuth();
  const { savedSpots, loading: savesLoading } = useSaves();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading]);

  const savedPlaceIds = new Set(savedSpots.map((s) => s.google_place_id));

  if (authLoading || savesLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col p-12">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Saved Spots</h1>

        {/* Search */}
        <div className="mb-10">
          <SpotSearchInput
            placeholder="Search for a spot to save…"
            excludePlaceIds={savedPlaceIds}
            renderAction={(r) => (
              <BookmarkButton
                spot={{
                  google_place_id: r.spot_id,
                  name: r.name,
                  address: r.address,
                  photo_url: r.photo_url,
                  rating: r.rating,
                  types: r.types,
                }}
              />
            )}
          />
        </div>

        {/* Saved spots */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Your saves {savedSpots.length > 0 && `(${savedSpots.length})`}
          </h2>
          {savedSpots.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No saved spots yet. Search above to find places to save.
            </p>
          ) : (
            <div className="space-y-3">
              {savedSpots.map((spot) => (
                <div
                  key={spot.id}
                  className="bg-white border border-gray-200 rounded-lg p-5"
                >
                  <SpotCard
                    className="flex-1"
                    spot={spot}
                    bookmark={<BookmarkButton spot={spot} />}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
