"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { useSaves } from "@/lib/savesContext";
import { getSavedPlaylists } from "@/lib/services/saves";
import type { SavedPlaylist } from "@/lib/services/saves";
import SpotCard from "@/components/SpotCard";
import BookmarkButton from "@/components/BookmarkButton";
import { getDefaultCover } from "@/lib/playlist-covers";
import { PlaylistCard } from "@/components/PlaylistCard";
import {
  SearchInput,
  type SearchInputState,
} from "@/components/ui/inputs/SearchInput";
import { searchSpots } from "@/lib/services/playlists";
import type { SearchResult } from "@/types";
import { AppBarConfig } from "@/lib/appBarContext";
import { AppBarDropdown } from "@/components/AppBarDropdown";
import { BottomPanel } from "@/components/ui/BottomPanel";
import { DropdownList } from "@/components/DropdownList";
import { DropdownListItem } from "@/components/DropdownListItem";
import { Spots } from "@/components/ui/icons/Spots";
import { List } from "@/components/ui/icons/List";
import { unsaveSpot, unsavePlaylist } from "@/lib/services/saves";
import { snackbar } from "@/components/ui/Snackbar";
import { Info } from "@/components/ui/icons/Info";
import { Bookmark } from "@/components/ui/icons/Bookmark";
import { IconButton } from "@/components/ui/IconButton";
import type { Spot } from "@/types";

export default function SavesPage() {
  const { user, loading: authLoading } = useAuth();
  const { savedSpots, loading: savesLoading, optimisticRemove, restoreSpot } = useSaves();
  const router = useRouter();

  const [tab, setTab] = useState<"spots" | "playlists">("spots");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [savedPlaylists, setSavedPlaylists] = useState<SavedPlaylist[] | null>(
    null,
  );
  const [playlistsLoading, setPlaylistsLoading] = useState(false);
  const [searchInputState, setSearchInputState] =
    useState<SearchInputState>("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null,
  );
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push("/signin");
  }, [user, authLoading]);

  useEffect(() => {
    if (!user || tab !== "playlists" || savedPlaylists !== null) return;
    setPlaylistsLoading(true);
    getSavedPlaylists(user.id).then((data) => {
      setSavedPlaylists(data);
      setPlaylistsLoading(false);
    });
  }, [user, tab, savedPlaylists]);

  const pendingRemovals = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const pendingPlaylistRemovals = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  function handleRemovePlaylist(saved: SavedPlaylist) {
    setSavedPlaylists((prev) => prev?.filter((p) => p.playlist_id !== saved.playlist_id) ?? null);
    const timer = setTimeout(() => {
      if (user) unsavePlaylist(user.id, saved.playlist_id);
      pendingPlaylistRemovals.current.delete(saved.playlist_id);
    }, 6000);
    pendingPlaylistRemovals.current.set(saved.playlist_id, timer);
    snackbar({
      icon: <Info />,
      message: "Playlist removed from saves",
      actionLabel: "Undo",
      onAction: () => {
        clearTimeout(pendingPlaylistRemovals.current.get(saved.playlist_id));
        pendingPlaylistRemovals.current.delete(saved.playlist_id);
        setSavedPlaylists((prev) => prev ? [saved, ...prev] : [saved]);
      },
    });
  }

  function handleRemove(spot: Spot) {
    optimisticRemove(spot.google_place_id);
    const timer = setTimeout(() => {
      if (user) unsaveSpot(user.id, spot.id);
      pendingRemovals.current.delete(spot.id);
    }, 6000);
    pendingRemovals.current.set(spot.id, timer);
    snackbar({
      icon: <Info />,
      message: "Spot removed from saves",
      actionLabel: "Undo",
      onAction: () => {
        clearTimeout(pendingRemovals.current.get(spot.id));
        pendingRemovals.current.delete(spot.id);
        restoreSpot(spot);
      },
    });
  }

  const savedPlaceIds = new Set(savedSpots.map((s) => s.google_place_id));

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const data = await searchSpots(searchQuery);
      setSearchResults(data.filter((r) => !savedPlaceIds.has(r.spot_id)));
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
    <main className="flex min-h-screen flex-col">
      <AppBarConfig
        left={
          <AppBarDropdown
            label={tab === "spots" ? "Spots" : "Playlists"}
            isOpen={dropdownOpen}
            onClick={() => setDropdownOpen((o) => !o)}
          />
        }
      />
      <BottomPanel
        isOpen={dropdownOpen}
        onClose={() => setDropdownOpen(false)}
        header="Select view"
        desktopVariant="floating"
      >
        <DropdownList>
          <DropdownListItem
            icon={<Spots />}
            label="Spots"
            selected={tab === "spots"}
            onClick={() => {
              setTab("spots");
              setDropdownOpen(false);
            }}
          />
          <DropdownListItem
            icon={<List />}
            label="Playlists"
            selected={tab === "playlists"}
            onClick={() => {
              setTab("playlists");
              setDropdownOpen(false);
            }}
          />
        </DropdownList>
      </BottomPanel>
      <div>
        {/* Spots tab */}
        {tab === "spots" && (
          <div>
            <form onSubmit={handleSearch} className="mb-4">
              <SearchInput
                state={searchInputState}
                value={searchQuery}
                placeholder="Search for a spot to save"
                onFocus={() => setSearchInputState("focused")}
                onBlur={() => setSearchInputState("default")}
                onChange={(v) => {
                  setSearchQuery(v);
                  setSearchInputState(v ? "typing" : "focused");
                }}
                onClear={() => {
                  setSearchQuery("");
                  setSearchResults(null);
                  setSearchInputState("focused");
                }}
              />
            </form>
            <p className="text-body-sm text-secondary py-1 mb-4">
              {savedSpots.length} {savedSpots.length === 1 ? "spot" : "spots"}
            </p>
            {searchResults !== null ? (
              <div className="space-y-3 mb-10">
                {searching && (
                  <p className="text-body-sm text-secondary">Searching…</p>
                )}
                {!searching && searchResults.length === 0 && (
                  <p className="text-body-sm text-secondary">
                    No results found.
                  </p>
                )}
                {searchResults.map((r) => (
                  <div
                    key={r.spot_id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-body-sm text-primary truncate">
                        {r.name}
                      </p>
                      <p className="text-body-sm text-secondary truncate">
                        {r.address}
                      </p>
                    </div>
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
                  </div>
                ))}
              </div>
            ) : savedSpots.length === 0 ? (
              <p className="text-body-sm text-secondary">
                No saved spots yet. Search above to find places to save.
              </p>
            ) : (
              <div className="space-y-3">
                {savedSpots.map((spot) => (
                  <div key={spot.id}>
                    <SpotCard
                      className="flex-1"
                      spot={spot}
                      bookmark={<BookmarkButton spot={spot} onRemove={() => handleRemove(spot)} />}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Playlists tab */}
        {tab === "playlists" && (
          <div>
            {savedPlaylists !== null && (
              <p className="text-body-sm text-secondary py-1 mb-4">
                {savedPlaylists.length}{" "}
                {savedPlaylists.length === 1 ? "playlist" : "playlists"}
              </p>
            )}
            {playlistsLoading ? (
              <p className="text-body-sm text-secondary">Loading…</p>
            ) : !savedPlaylists || savedPlaylists.length === 0 ? (
              <p className="text-body-sm text-secondary">
                No saved playlists yet.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {savedPlaylists.map(({ id, playlist }) => (
                  <PlaylistCard
                    key={id}
                    size="sm"
                    image={
                      playlist.cover_photo_url ?? getDefaultCover(playlist.city)
                    }
                    city={playlist.city}
                    name={playlist.name}
                    href={`/playlists/${playlist.slug}`}
                    className="w-full"
                    topRight={
                      <span onClick={(e) => e.preventDefault()}>
                        <IconButton
                          variant="ghost"
                          icon={<Bookmark active />}
                          label="Remove from saves"
                          className="text-white"
                          onClick={() => handleRemovePlaylist({ id, playlist_id: playlist.id, playlist })}
                        />
                      </span>
                    }
                    bottomCenter={
                      <p className="text-body-xs text-neon">@{playlist.profiles.username}</p>
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
