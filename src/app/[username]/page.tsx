import { notFound } from "next/navigation";
import ProfileHeader from "./ProfileHeader";
import { getUserByUsername } from "@/lib/services/users";
import { getPlaylistsByUser } from "@/lib/services/playlists";
import { createClient } from "@/lib/supabase/server";
import type { Playlist } from "@/types";
import Link from "next/link";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

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
    <main className="flex min-h-screen flex-col items-center">
      <div className="w-full p-[var(--space-page)]">
        <ProfileHeader profile={profile} />

        {playlists.length === 0 ? (
          <div className="hidden bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-secondary">No public playlists yet</p>
          </div>
        ) : (
          <div className="grid gap-20 sm:grid-cols-2 xl:grid-cols-3 mt-4 lg:mt-16">
            {playlists.map((playlist) => (
              <Link
                key={playlist.id}
                href={`/playlists/${playlist.slug}`}
                className="block"
              >
                <Card
                  size="lg"
                  city={playlist.name}
                  playlistName={playlist.description ?? undefined}
                  className="w-full bg-black rounded-[.75rem]"
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
