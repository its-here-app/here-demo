"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { TopNavigation } from "@/components/ui/TopNavigation";
import { Overflow } from "@/components/ui/icons/Overflow";

export default function TopNav() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

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
        <TopNavigation variant="profile" title={`@${profileUsername}`} rightAction={<Overflow orientation="horizontal" />} />
      ) : (
        <TopNavigation variant="logo-location" />
      )}
    </div>
  );
}
