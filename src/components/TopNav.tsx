"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { NavBar } from "@/components/ui/NavBar";
import { IconButton } from "@/components/ui/IconButton";
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

  // Hide on auth and playlist pages
  if (
    pathname.startsWith("/signin") ||
    pathname.startsWith("/create-account") ||
    pathname.startsWith("/users/registration") ||
    pathname.startsWith("/playlists")
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
        <NavBar
          className="h-14 pb-2 pt-3"
          left={
            showBack ? (
              <IconButton
                variant="secondary"
                icon={<ArrowLeft />}
                label="Back"
                onClick={() => router.back()}
              />
            ) : undefined
          }
          center={
            <p className="text-body-xs text-secondary">@{profileUsername}</p>
          }
          right={
            <IconButton
              variant="secondary"
              icon={<Overflow orientation="horizontal" />}
              label="More options"
              onClick={() => document.dispatchEvent(new CustomEvent("profile-overflow"))}
            />
          }
        />
      ) : (
        <NavBar variant="logo-location" />
      )}
    </div>
  );
}
