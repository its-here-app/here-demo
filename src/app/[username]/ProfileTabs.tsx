"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Tabs, Tab, TabPanels } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { List } from "@/components/ui/icons/List";
import { Map } from "@/components/ui/icons/Map";
import { Spots } from "@/components/ui/icons/Spots";
import { IconButton } from "@/components/ui/IconButton";
import { Share } from "@/components/ui/icons/Share";
import { Lock } from "@/components/ui/icons/Lock";
import { Asterisk } from "@/components/ui/icons/Asterisk";
import BookmarkButton from "@/components/BookmarkButton";
import { useAuth } from "@/lib/authContext";
import { useShare } from "@/lib/useShare";

import { PlaylistCard } from "@/components/PlaylistCard";
import ProfileMessage from "./ProfileMessage";
import { playlistUrl } from "@/lib/playlistUrl";
import type { Playlist } from "@/types";
import { playlistDocTitle } from "@/lib/playlistDocTitle";

interface ProfileTabsProps {
  playlists: Playlist[];
  profileId: string;
  username: string;
}

export default function ProfileTabs({
  playlists: initialPlaylists,
  profileId,
  username,
}: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<"playlists" | "cities" | "spots">(
    "playlists",
  );
  const [playlists, setPlaylists] = useState(initialPlaylists);
  const { user } = useAuth();

  useEffect(() => {
    const deletingId = sessionStorage.getItem("deletingPlaylistId");
    if (deletingId) {
      sessionStorage.removeItem("deletingPlaylistId");
      setPlaylists((prev) => prev.filter((p) => p.id !== deletingId));
    }
  }, []);
  const { share } = useShare();

  const isActualOwner = !!user && user.id === profileId;
  const isLoggedIn = !!user;

  const tabIndex = { playlists: 0, cities: 1, spots: 2 }[activeTab];

  const playlistCount = playlists.length;
  const cityCount = new Set(playlists.map((p) => p.city)).size;
  const spotCount = playlists.reduce((sum, p) => sum + (p.spot_count ?? 0), 0);

  return (
    <div className="mt-4 lg:mt-16">
      <Tabs className="mb-[var(--space-page-sm)]">
        <Tab
          title={`${playlistCount} ${playlistCount === 1 ? "playlist" : "playlists"}`}
          active={activeTab === "playlists"}
          onClick={() => setActiveTab("playlists")}
          icon={<List />}
        />
        <Tab
          title={`${cityCount} ${cityCount === 1 ? "city" : "cities"}`}
          active={activeTab === "cities"}
          onClick={() => setActiveTab("cities")}
          icon={<Map />}
        />
        <Tab
          title={`${spotCount} ${spotCount === 1 ? "spot" : "spots"}`}
          active={activeTab === "spots"}
          onClick={() => setActiveTab("spots")}
          icon={<Spots />}
        />
      </Tabs>

      <TabPanels activeIndex={tabIndex}>
        {/* Playlists */}
        <div>
          {playlists.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {playlists.map((playlist: Playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  size="lg"
                  image={playlist.cover_photo_url ?? undefined}
                  city={playlist.city}
                  name={playlist.name}
                  href={playlistUrl(username, playlist.city, playlist.name)}
                  className="w-full"
                  bottomCenter={
                    <span className="flex items-center gap-1 text-body-sm text-neon">
                      <Asterisk />
                      {playlist.spot_count ?? 0}
                    </span>
                  }
                  topLeft={
                    isActualOwner && !playlist.is_public ? (
                      <Lock active className="size-5 text-white" />
                    ) : undefined
                  }
                  topRight={
                    isActualOwner ? (
                      <IconButton
                        variant="overlay"
                        icon={<Share />}
                        label="Share playlist"
                        onClick={(e) => {
                          e.preventDefault();
                          share(
                            `${window.location.origin}${playlistUrl(username, playlist.city, playlist.name)}`,
                            playlistDocTitle(
                              playlist.city,
                              playlist.name,
                              username,
                            ),
                          );
                        }}
                      />
                    ) : isLoggedIn ? (
                      <div className="flex flex-row gap-2">
                        <span onClick={(e) => e.preventDefault()}>
                          <BookmarkButton
                            playlistId={playlist.id}
                            variant="overlay"
                          />
                        </span>
                        <IconButton
                          variant="overlay"
                          icon={<Share />}
                          label="Share playlist"
                          onClick={(e) => {
                            e.preventDefault();
                            share(
                              `${window.location.origin}${playlistUrl(username, playlist.city, playlist.name)}`,
                              playlistDocTitle(
                                playlist.city,
                                playlist.name,
                                username,
                              ),
                            );
                          }}
                        />
                      </div>
                    ) : undefined
                  }
                />
              ))}
            </div>
          ) : (
            <ProfileMessage header={isActualOwner ? "Get started" : undefined}>
              <p>
                {isActualOwner
                  ? "You don't have any lists yet. Create your first to organize your favorite places and share them with friends"
                  : "No public lists found"}
              </p>
              {isActualOwner && (
                <Link href="/playlists/new">
                  <Button size="lg" variant="tonal" className="bg-neon mt-6">
                    Create a list
                  </Button>
                </Link>
              )}
            </ProfileMessage>
          )}
        </div>

        {/* Cities */}
        <div>
          <div className="text-center mt-16">
            <p className="text-body-sm text-secondary">No cities yet</p>
          </div>
        </div>

        {/* Spots */}
        <div>
          <div className="text-center mt-16">
            <p className="text-body-sm text-secondary">No spots yet</p>
          </div>
        </div>
      </TabPanels>
    </div>
  );
}
