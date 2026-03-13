import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProfileHeader from "./ProfileHeader";
import { getUserByUsername } from "@/lib/services/users";
import { getPlaylistsByUser } from "@/lib/services/playlists";
import { createClient } from "@/lib/supabase/server";
import { Block } from "../../components/ui/icons/Block";
import ProfileTabs from "./ProfileTabs";

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
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ pendingDelete?: string }>;
}) {
  const [{ username }, { pendingDelete }] = await Promise.all([
    params,
    searchParams,
  ]);
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
  const [rawPlaylists, blockRow] = await Promise.all([
    getPlaylistsByUser(profile.id, !isOwnProfile),
    user && !isOwnProfile
      ? supabase
          .from("blocks")
          .select("id")
          .eq("blocker_id", user.id)
          .eq("blocked_id", profile.id)
          .maybeSingle()
      : null,
  ]);
  const isBlocked = !!blockRow?.data;
  const playlists = rawPlaylists.filter((p) => p.id !== pendingDelete);

  return (
    <main className="flex flex-col items-center">
      <div className="w-full pt-10 lg:pt-0">
        <ProfileHeader profile={profile} />

        {isBlocked ? (
          <div className="text-center flex flex-col items-center mt-16">
            <div className="size-12 rounded-full bg-black/5 flex items-center justify-center mb-4">
              <Block className="size-9" />
            </div>
            <div className="max-w-sm">
              <h1 className="text-header-radio-1 mb-2">
                You have blocked this account
              </h1>

              <div className="text-body-sm text-secondary mb-6">
                <p className="mb-2">
                  Unblock this account to see their playlists and saves.
                </p>
                <p>
                  When you unblock them, they’ll also be able to find your
                  profile and see your content.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <ProfileTabs playlists={playlists} isOwnProfile={isOwnProfile} />
        )}
      </div>
    </main>
  );
}
