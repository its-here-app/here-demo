import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProfileHeader from "./ProfileHeader";
import { getUserByUsername } from "@/lib/services/users";
import { createClient } from "@/lib/supabase/server";
import PlaylistSection from "./PlaylistSection";
import PlaylistSkeleton from "./PlaylistSkeleton";

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

  return (
    <main className="flex flex-col items-center">
      <div className="w-full">
        <ProfileHeader profile={profile} />
        <Suspense fallback={<PlaylistSkeleton />}>
          <PlaylistSection
            profileId={profile.id}
            isOwnProfile={isOwnProfile}
            userId={user?.id}
            pendingDelete={pendingDelete}
            username={profile.username}
          />
        </Suspense>
      </div>
    </main>
  );
}
