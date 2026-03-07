"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { TopNavigation } from "@/components/ui/TopNavigation";
import { Overflow } from "@/components/ui/icons/Overflow";
import { ArrowLeft } from "@/components/ui/icons/ArrowLeft";
import { useEffect, useState } from "react";

export default function TopNav() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    function onMounted(e: Event) {
      setShowBack(!(e as CustomEvent<{ isOwnProfile: boolean }>).detail.isOwnProfile);
    }
    function onUnmounted() { setShowBack(false); }
    document.addEventListener("profile-mounted", onMounted);
    document.addEventListener("profile-unmounted", onUnmounted);
    return () => {
      document.removeEventListener("profile-mounted", onMounted);
      document.removeEventListener("profile-unmounted", onUnmounted);
    };
  }, []);

  // Hide on auth pages
  if (
    pathname.startsWith("/signin") ||
    pathname.startsWith("/create-account") ||
    pathname.startsWith("/users/registration")
  ) {
    return null;
  }

  if (loading || !user) return null;

  const knownRoutes = ["/signin", "/create-account", "/users", "/saves", "/playlists"];
  const isProfilePage =
    /^\/[^/]+$/.test(pathname) &&
    !knownRoutes.some((r) => pathname.startsWith(r));
  const profileUsername = isProfilePage ? pathname.slice(1) : null;

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white">
      {isProfilePage ? (
        <TopNavigation
          variant="profile"
          title={`@${profileUsername}`}
          leftAction={
            showBack ? (
              <button aria-label="Back" onClick={() => router.back()} className="cursor-pointer">
                <ArrowLeft />
              </button>
            ) : null
          }
          rightAction={
            <button
              aria-label="More options"
              onClick={() => document.dispatchEvent(new CustomEvent("profile-overflow"))}
              className="cursor-pointer"
            >
              <Overflow orientation="horizontal" />
            </button>
          }
        />
      ) : (
        <TopNavigation variant="logo-location" />
      )}
    </div>
  );
}
