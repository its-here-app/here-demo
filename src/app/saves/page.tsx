"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { useSaves } from "@/lib/savesContext";
import { searchSpots } from "@/lib/services/playlists";
import SpotCard from "@/components/SpotCard";
import BookmarkButton from "@/components/BookmarkButton";
import type { SearchResult } from "@/types";

export default function SavesPage() {
  const { user, loading: authLoading } = useAuth();
  const { savedSpots, loading: savesLoading } = useSaves();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading]);

  const savedPlaceIds = new Set(savedSpots.map((s) => s.google_place_id));

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setError("");
    try {
      const results = await searchSpots(searchQuery);
      setSearchResults(results.filter((r) => !savedPlaceIds.has(r.spot_id)));
    } catch {
      setError("Failed to search spots.");
    } finally {
      setSearching(false);
    }
  }

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
        <form onSubmit={handleSearch} className="flex gap-2 mb-10">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a spot to save…"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={searching}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {searching ? "Searching…" : "Search"}
          </button>
        </form>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm mb-6">
            {error}
          </div>
        )}

        {/* Search results */}
        {searchResults.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Results
            </h2>
            <div className="space-y-3">
              {searchResults.map((place) => (
                <div
                  key={place.spot_id}
                  className="bg-white border border-gray-200 rounded-lg p-5"
                >
                  <SpotCard
                    className="flex-1"
                    spot={{
                      name: place.name,
                      address: place.address,
                      photo_url: place.photo_url,
                      rating: place.rating,
                      types: place.types,
                    }}
                    bookmark={
                      <BookmarkButton
                        spot={{
                          google_place_id: place.spot_id,
                          name: place.name,
                          address: place.address,
                          photo_url: place.photo_url,
                          rating: place.rating,
                          types: place.types,
                        }}
                      />
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}

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
