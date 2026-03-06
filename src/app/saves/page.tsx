"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { useSaves } from "@/lib/savesContext";
import { getSavedPlaylists } from "@/lib/services/saves";
import type { SavedPlaylist } from "@/lib/services/saves";
import SpotCard from "@/components/SpotCard";
import BookmarkButton from "@/components/BookmarkButton";
import PlaylistBookmarkButton from "@/components/PlaylistBookmarkButton";
import SpotSearchInput from "@/components/SpotSearchInput";
import { getDefaultCover } from "@/lib/playlist-covers";

export default function SavesPage() {
  const { user, loading: authLoading } = useAuth();
  const { savedSpots, loading: savesLoading } = useSaves();
  const router = useRouter();

  const [tab, setTab] = useState<"spots" | "playlists">("spots");
  const [savedPlaylists, setSavedPlaylists] = useState<SavedPlaylist[] | null>(null);
  const [playlistsLoading, setPlaylistsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading]);

  useEffect(() => {
    if (!user || tab !== "playlists" || savedPlaylists !== null) return;
    setPlaylistsLoading(true);
    getSavedPlaylists(user.id).then((data) => {
      setSavedPlaylists(data);
      setPlaylistsLoading(false);
    });
  }, [user, tab, savedPlaylists]);

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
        <h1 className="text-3xl font-bold mb-6">Saves</h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setTab("spots")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === "spots"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Spots {savedSpots.length > 0 && `(${savedSpots.length})`}
          </button>
          <button
            onClick={() => setTab("playlists")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === "playlists"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Playlists {savedPlaylists && savedPlaylists.length > 0 && `(${savedPlaylists.length})`}
          </button>
        </div>

        {/* Spots tab */}
        {tab === "spots" && (
          <div>
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
            {savedSpots.length === 0 ? (
              <p className="text-gray-400 text-sm">No saved spots yet. Search above to find places to save.</p>
            ) : (
              <div className="space-y-3">
                {savedSpots.map((spot) => (
                  <div key={spot.id} className="bg-white border border-gray-200 rounded-lg p-5">
                    <SpotCard className="flex-1" spot={spot} bookmark={<BookmarkButton spot={spot} />} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Playlists tab */}
        {tab === "playlists" && (
          <div>
            {playlistsLoading ? (
              <p className="text-gray-400 text-sm">Loading…</p>
            ) : !savedPlaylists || savedPlaylists.length === 0 ? (
              <p className="text-gray-400 text-sm">No saved playlists yet.</p>
            ) : (
              <div className="space-y-3">
                {savedPlaylists.map(({ id, playlist }) => (
                  <Link
                    key={id}
                    href={`/playlists/${playlist.slug}`}
                    className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <img
                      src={playlist.cover_photo_url ?? getDefaultCover(playlist.city)}
                      alt={playlist.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{playlist.name}</p>
                      <p className="text-sm text-gray-500 truncate">{playlist.city}</p>
                      <p className="text-xs text-gray-400">
                        @{playlist.profiles.username} · {playlist.spot_count} spots
                      </p>
                    </div>
                    <PlaylistBookmarkButton playlistId={playlist.id} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
