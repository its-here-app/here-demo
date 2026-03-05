"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { getProfile } from "@/lib/services/users";
import { TopNavigation } from "@/components/ui/TopNavigation";
import { Overflow } from "@/components/ui/icons/Overflow";
import type { Profile } from "@/types";

export default function TopNav() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!user) return;
    getProfile(user.id).then(setProfile);
  }, [user]);

  // Hide on auth pages
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/create-account") ||
    pathname.startsWith("/users/registration")
  ) {
    return null;
  }

  if (loading || !user) return null;

  const username = profile?.username ?? null;
  const isProfile = username !== null && pathname.startsWith(`/${username}`);

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white">
      {isProfile ? (
        <TopNavigation variant="profile" title={`@${username}`} rightAction={<Overflow orientation="horizontal" />} />
      ) : (
        <TopNavigation variant="logo-location" />
      )}
    </div>
  );
}
