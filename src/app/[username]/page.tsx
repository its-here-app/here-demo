import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProfileHeader from "./ProfileHeader";
import { getUserByUsername } from "@/lib/services/users";
import { getPlaylistsByUser } from "@/lib/services/playlists";
import { createClient } from "@/lib/supabase/server";
import type { Playlist } from "@/types";
import Link from "next/link";
import { Button } from "../../components/ui/Button";
import { PlaylistCard } from "../../components/ui/PlaylistCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return { title: `@${username} • Here*` };
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();
  const [
    profile,
    {
      data: { user },
    },
  ] = await Promise.all([getUserByUsername(username), supabase.auth.getUser()]);

  if (!profile) {
    notFound();
  }

  const isOwnProfile = user?.id === profile.id;
  const playlists: Playlist[] = await getPlaylistsByUser(
    profile.id,
    !isOwnProfile,
  );

  return (
    <main className="flex flex-col items-center">
      <div className="w-full pt-10 lg:pt-0">
        <ProfileHeader profile={profile} />

        {playlists.length === 0 ? (
          <div className="hidden bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-secondary">No public playlists yet</p>
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3 mt-4 lg:mt-16">
            {playlists.map((playlist) => (
              <Link
                key={playlist.id}
                href={`/playlists/${playlist.slug}`}
                className="block"
              >
                <PlaylistCard
                  size="lg"
                  image={playlist.cover_photo_url ?? undefined}
                  city={playlist.name}
                  playlistName={playlist.description ?? undefined}
                  className="w-full"
                />
              </Link>
            ))}
          </div>
        )}
        {/* Get started / No lists */}
        {playlists.length === 0 && (
          <div className="text-center flex flex-col items-center mt-16">
            {isOwnProfile && (
              <h1 className="text-display-radio-2 mb-[.5rem]">Get started</h1>
            )}
            <p className="text-body-sm text-secondary max-w-70 mb-6">
              {isOwnProfile
                ? "You don’t have any lists yet. Create your first to organize your favorite places and share them with friends"
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
    </main>
  );
}
