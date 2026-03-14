"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, Tab } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { List } from "@/components/ui/icons/List";
import { Map } from "@/components/ui/icons/Map";
import { Spots } from "@/components/ui/icons/Spots";
import { IconButton } from "@/components/ui/IconButton";
import { Share } from "@/components/ui/icons/Share";
import BookmarkButton from "@/components/BookmarkButton";
import { useAuth } from "@/lib/authContext";
import { useShare } from "@/lib/useShare";

import { PlaylistCard } from "@/components/PlaylistCard";
import ProfileMessage from "./ProfileMessage";
import type { Playlist } from "@/types";

interface ProfileTabsProps {
  playlists: Playlist[];
  isOwnProfile: boolean;
}

export default function ProfileTabs({
  playlists,
  isOwnProfile,
}: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<"playlists" | "cities" | "spots">(
    "playlists",
  );
  const { user } = useAuth();
  const { share } = useShare();

  const tabIndex = { playlists: 0, cities: 1, spots: 2 }[activeTab];

  const playlistCount = playlists.length;
  const cityCount = new Set(playlists.map((p) => p.city)).size;
  const spotCount = playlists.reduce((sum, p) => sum + (p.spot_count ?? 0), 0);

  return (
    <div className="mt-4 lg:mt-16">
      <Tabs className="mb-6">
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

      <div className="overflow-hidden">
        <div
          className="flex w-[300%] transition-transform duration-400 ease-in-out"
          style={{ transform: `translateX(${-(tabIndex * 100) / 3}%)` }}
        >
          {/* Playlists */}
          <div className="w-1/3 min-w-0">
            {playlists.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {playlists.map((playlist: Playlist) => (
                  <PlaylistCard
                    key={playlist.id}
                    size="lg"
                    image={playlist.cover_photo_url ?? undefined}
                    city={playlist.city}
                    name={playlist.name}
                    href={`/playlists/${playlist.slug}`}
                    className="w-full"
                    bottomCenter={
                      <p className="text-body-sm text-neon">* {playlist.spot_count ?? 0}</p>
                    }
                    topRight={
                      !isOwnProfile && user ? (
                        <div className="flex flex-row gap-2">
                          <span onClick={(e) => e.preventDefault()}>
                            <BookmarkButton playlistId={playlist.id} variant="overlay" />
                          </span>
                          <IconButton
                            variant="overlay"
                            icon={<Share />}
                            label="Share playlist"
                            onClick={(e) => {
                              e.preventDefault();
                              share(`${window.location.origin}/playlists/${playlist.slug}`);
                            }}
                          />
                        </div>
                      ) : undefined
                    }
                  />
                ))}
              </div>
            ) : (
              <ProfileMessage header={isOwnProfile ? "Get started" : undefined}>
                <p>
                  {isOwnProfile
                    ? "You don't have any lists yet. Create your first to organize your favorite places and share them with friends"
                    : "No public lists found"}
                </p>
                {isOwnProfile && (
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
          <div className="w-1/3 min-w-0">
            <div className="text-center mt-16">
              <p className="text-body-sm text-secondary">No cities yet</p>
            </div>
          </div>

          {/* Spots */}
          <div className="w-1/3 min-w-0">
            <div className="text-center mt-16">
              <p className="text-body-sm text-secondary">No spots yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
