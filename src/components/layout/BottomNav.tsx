"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { getProfile } from "@/lib/services/users";
import {
  BottomNavigation,
  type BottomNavTab,
} from "@/components/ui/BottomNavigation";
import { openCreatePlaylist } from "@/components/modals/CreatePlaylistFlow";
import type { Profile } from "@/types";

export default function BottomNav() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    getProfile(user.id).then(setProfile);
  }, [user]);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    function update() {
      if (!navRef.current) return;
      const bottom = Math.max(0, window.innerHeight - vv!.height - vv!.offsetTop);
      navRef.current.style.bottom = `${bottom}px`;
    }

    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    update();

    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  const username = profile?.username ?? null;

  if (loading || !user || pathname.startsWith("/signin")) return null;

  const activeTab: BottomNavTab = pathname.startsWith("/search")
    ? "search"
    : pathname === "/saves"
      ? "saved"
      : username && pathname.startsWith(`/${username}`)
        ? "profile"
        : "home";

  function handleTabChange(tab: BottomNavTab) {
    switch (tab) {
      case "home":
        return router.push("/");
      case "search":
        return router.push("/search");
      case "saved":
        return router.push("/saves");
      case "profile":
        return router.push(username ? `/${username}` : "/");
    }
  }

  return (
    <div ref={navRef} className="fixed bottom-0 left-0 right-0 z-50 lg:translate-y-[100%] transition-transform duration-400">
      <BottomNavigation
        demo
        activeTab={activeTab}
        avatarUrl={profile?.avatar_url ?? undefined}
        onTabChange={handleTabChange}
        onAdd={openCreatePlaylist}
      />
    </div>
  );
}
