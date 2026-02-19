// src/app/[username]/page.tsx
import { createClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import ProfileHeader from "./ProfileHeader";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
}

async function getUserByUsername(
  username: string
): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !data) return null;
  return data;
}

async function getUserPlaylists(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data;
}

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

  const playlists = await getUserPlaylists(profile.id);

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
              <div
                key={playlist.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">{playlist.name}</h3>
                {playlist.description && (
                  <p className="text-gray-600 text-sm">
                    {playlist.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
