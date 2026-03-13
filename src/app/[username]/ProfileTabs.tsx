"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, Tab } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { List } from "@/components/ui/icons/List";
import { Map } from "@/components/ui/icons/Map";
import { Spots } from "@/components/ui/icons/Spots";

import { PlaylistCard } from "@/components/PlaylistCard";
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

  const tabIndex = { playlists: 0, cities: 1, spots: 2 }[activeTab];

  return (
    <div className="mt-4 lg:mt-16">
      <Tabs className="mb-6">
        <Tab
          title="Playlists"
          active={activeTab === "playlists"}
          onClick={() => setActiveTab("playlists")}
          icon={<List />}
        />
        <Tab
          title="Cities"
          active={activeTab === "cities"}
          onClick={() => setActiveTab("cities")}
          icon={<Map />}
        />
        <Tab
          title="Spots"
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
                  />
                ))}
              </div>
            ) : (
              <div className="text-center flex flex-col items-center mt-16">
                {isOwnProfile && (
                  <h1 className="text-display-radio-2 mb-[.5rem]">Get started</h1>
                )}
                <p className="text-body-sm text-secondary max-w-70 mb-6">
                  {isOwnProfile
                    ? "You don't have any lists yet. Create your first to organize your favorite places and share them with friends"
                    : "No public lists found"}
                </p>
                {isOwnProfile && (
                  <Link href="/playlists/new">
                    <Button size="lg" variant="tonal" className="bg-neon">
                      Create a list
                    </Button>
                  </Link>
                )}
              </div>
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
