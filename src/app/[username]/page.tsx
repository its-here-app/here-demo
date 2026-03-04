import { notFound } from "next/navigation";
import ProfileHeader from "./ProfileHeader";
import { getUserByUsername } from "@/lib/services/users";
import { getPlaylistsByUser } from "@/lib/services/playlists";
import type { Playlist } from "@/types";
import Link from "next/link";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getUserByUsername(username);

  if (!profile) {
    notFound();
  }

  const playlists: Playlist[] = await getPlaylistsByUser(profile.id);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-2xl">
        <ProfileHeader profile={profile} />

        <h2 className="text-xl font-semibold mb-4">
          Public Playlists {playlists.length > 0 && `(${playlists.length})`}
        </h2>

        {playlists.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600">No public playlists yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {playlists.map((playlist) => (
              <Link
                key={playlist.id}
                href={`/playlists/${playlist.slug}`}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow block"
              >
                <h3 className="text-lg font-semibold mb-2">{playlist.name}</h3>
                {playlist.description && (
                  <p className="text-gray-600 text-sm">{playlist.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
