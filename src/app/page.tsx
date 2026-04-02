"use client";

import { useEffect, useState, useCallback } from "react";
import { AppBarConfig } from "@/lib/appBarContext";
import { FullLogo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Map } from "@/components/ui/icons/Map";
import { CardShelf } from "@/components/ui/CardShelf";
import { PlaylistCard } from "@/components/PlaylistCard";
import { IconButton } from "@/components/ui/IconButton";
import { Avatar } from "@/components/ui/Avatar";
import { ArrowLeft } from "@/components/ui/icons/ArrowLeft";
import { ArrowRight } from "@/components/ui/icons/ArrowRight";
import { useAuth } from "@/lib/authContext";
import { getPlaylistsByUser, getRecentFollowingPlaylists } from "@/lib/services/playlists";
import { getUserUsername, getProfile } from "@/lib/services/users";
import { createClient } from "@/lib/supabase/client";
import { upsertCityAction } from "@/lib/actions/cities";
import { updateProfileCityAction } from "@/lib/actions/users";
import { playlistUrl } from "@/lib/playlistUrl";
import type { Playlist } from "@/types";
import { useRouter } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import { openCreatePlaylist } from "@/components/modals/CreatePlaylistFlow";
import CityPickerModal from "@/components/modals/CityPickerModal";
import { Skeleton } from "@/components/ui/Skeleton";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [latestPlaylist, setLatestPlaylist] = useState<Playlist | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [followingPlaylists, setFollowingPlaylists] = useState<(Playlist & { username: string; avatar_url: string | null })[]>([]);
  const [cityName, setCityName] = useState<string | null>(null);
  const [cityPickerOpen, setCityPickerOpen] = useState(false);
  const [yourPlaylistsLoaded, setYourPlaylistsLoaded] = useState(false);
  const [followingLoaded, setFollowingLoaded] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!loading && !user) router.push("/signin");
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    getUserUsername(user.id).then(setUsername);
    getProfile(user.id).then(async (profile) => {
      if (profile?.city_id) {
        const supabase = createClient();
        const { data: city } = await supabase
          .from("cities")
          .select("display_name")
          .eq("id", profile.city_id)
          .single();
        if (city) setCityName(city.display_name);
      }
    });
    getPlaylistsByUser(user.id).then((playlists) => {
      setLatestPlaylist(playlists[0] ?? null);
      setYourPlaylistsLoaded(true);
    });
    getRecentFollowingPlaylists(user.id).then((playlists) => {
      setFollowingPlaylists(playlists);
      setFollowingLoaded(true);
    });
  }, [user]);

  return (
    <>
      <AppBarConfig
        left={<div className="lg:hidden"><FullLogo /></div>}
        right={
          <Button
            variant="tonal"
            size="sm"
            leftIcon={<Map />}
            onClick={() => setCityPickerOpen(true)}
          >
            {cityName ?? "Choose city"}
          </Button>
        }
      />
      <div className="flex flex-col gap-12">
        <CardShelf title="Your playlists">
          {!yourPlaylistsLoaded ? (
            <div className="flex items-center gap-2 bg-surface-subtle rounded-sm p-2 w-full">
              <Skeleton className="shrink-0 size-[3.125rem] rounded-xs" />
              <div className="flex-1 flex flex-col gap-1.5">
                <Skeleton className="h-3 w-1/4 rounded-full" />
                <Skeleton className="h-3 w-1/2 rounded-full" />
              </div>
            </div>
          ) : latestPlaylist && username ? (
            <PlaylistCard
              size="xs"
              city={latestPlaylist.city}
              name={latestPlaylist.name}
              subtitle={latestPlaylist.description ?? undefined}
              image={latestPlaylist.cover_photo_url ?? undefined}
              href={playlistUrl(username, latestPlaylist.city, latestPlaylist.name)}
            />
          ) : (
            <PlaylistCard
              size="xs"
              city="Los Angeles"
              name="Create a playlist"
              onClick={openCreatePlaylist}
            />
          )}
        </CardShelf>
        <CardShelf
          title="Shared recently"
          titleRight={
            followingLoaded && followingPlaylists.length > 0 ? (
              <div className={`gap-2 ${followingPlaylists.length <= 3 ? "hidden [@media(hover:hover)]:max-lg:flex" : "hidden [@media(hover:hover)]:flex"}`}>
                <IconButton variant="secondary" icon={<ArrowLeft className="size-6" />} onClick={scrollPrev} />
                <IconButton variant="secondary" icon={<ArrowRight className="size-6" />} onClick={scrollNext} />
              </div>
            ) : undefined
          }
        >
          {!followingLoaded ? (
            <div className="flex gap-2 overflow-hidden -mx-[var(--space-page-sm)] px-[var(--space-page-sm)]">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="w-60 shrink-0 lg:w-[calc(33.333%-0.333rem)] aspect-square rounded-sm" />
              ))}
            </div>
          ) : followingPlaylists.length > 0 ? (
            <div ref={emblaRef} className="overflow-hidden -mx-[var(--space-page-sm)]">
              <div className="flex gap-2 px-[var(--space-page-sm)]">
                {followingPlaylists.map((playlist) => (
                  <div key={playlist.id} className="w-60 shrink-0 lg:w-[calc(33.333%-0.333rem)]">
                    <PlaylistCard
                      size="md"
                      city={playlist.city}
                      name={playlist.name}
                      image={playlist.cover_photo_url ?? undefined}
                      href={playlistUrl(playlist.username, playlist.city, playlist.name)}
                      bottomLeft={
                        <Avatar
                          size="sm"
                          src={playlist.avatar_url ?? undefined}
                          username={playlist.username}
                        />
                      }
                    />
                  </div>
                ))}
                <div className="w-0 shrink-0 lg:hidden" />
              </div>
            </div>
          ) : null}
        </CardShelf>
        <CardShelf title="Today's most saved" />
      </div>

      <CityPickerModal
        isOpen={cityPickerOpen}
        onClose={() => setCityPickerOpen(false)}
        onSelect={async (city) => {
          setCityName(city.display_name);
          const cityId = await upsertCityAction({
            google_place_id: city.google_place_id,
            display_name: city.display_name,
          });
          await updateProfileCityAction(cityId);
        }}
      />
    </>
  );
}
