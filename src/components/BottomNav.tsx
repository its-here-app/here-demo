"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { getProfile } from "@/lib/services/users";
import { BottomNavigation, type BottomNavTab } from "@/components/ui/BottomNavigation";
import type { Profile } from "@/types";

export default function BottomNav() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!user) return;
    getProfile(user.id).then(setProfile);
  }, [user]);

  const username = profile?.username ?? null;

  if (loading || !user) return null;

  const activeTab: BottomNavTab =
    pathname.startsWith("/search") ? "search"
    : pathname === "/saves" ? "saved"
    : username && pathname.startsWith(`/${username}`) ? "profile"
    : "home";

  function handleTabChange(tab: BottomNavTab) {
    switch (tab) {
      case "home":    return router.push("/");
      case "search":  return router.push("/search");
      case "saved":   return router.push("/saves");
      case "profile": return router.push(username ? `/${username}` : "/");
    }
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
      <BottomNavigation
        demo
        activeTab={activeTab}
        avatarUrl={profile?.avatar_url ?? undefined}
        onTabChange={handleTabChange}
        onAdd={() => router.push("/playlists/new")}
      />
    </div>
  );
}
