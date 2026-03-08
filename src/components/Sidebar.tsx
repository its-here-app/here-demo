"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { signOut, getUserUsername, getProfile } from "@/lib/services/users";
import { FullLogo } from "./ui/Logo";
import { Add } from "./ui/icons/Add";
import { Bookmark } from "./ui/icons/Bookmark";
import { Logout } from "./ui/icons/Logout";
import { Avatar } from "./ui/Avatar";

export default function Sidebar() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    getUserUsername(user.id).then(setUsername);
    getProfile(user.id).then((p) => setAvatarUrl(p?.avatar_url || ""));
  }, [user]);

  if (loading || !user || pathname.startsWith("/signin")) return null;

  async function handleSignOut() {
    await signOut();
    router.push("/signin");
  }

  const profileHref = username ? `/${username}` : "/";

  return (
    <aside className="flex flex-col w-[var(--sidebar-width)] p-[var(--space-page)] bg-white h-screen fixed left-0 top-0 -ml-[var(--sidebar-width)] lg:ml-0 transition-[margin] duration-400">
      {/* Logo */}
      <div className="">
        <FullLogo className="w-20" />
      </div>

      {/* Nav */}
      <nav className="-ml-2 flex flex-col gap-8 mt-[5rem]">
        <Link href="/saves" className="flex items-center gap-5">
          <Bookmark
            active={pathname === "/saves"}
            className="size-8 shrink-0 text-black"
          />
          <span className="text-header-radio-3 text-black">Saves</span>
        </Link>

        <Link href={profileHref} className="flex items-center gap-5">
          <span className="size-8 shrink-0 flex items-center justify-center">
            <Avatar
              src={avatarUrl}
              alt="Profile"
              focus={pathname === profileHref}
            />
          </span>
          <span className="text-header-radio-3 text-black">Profile</span>
        </Link>

        <div className="border-t border-black/10 w-full" />

        <Link href="/playlists/new" className="flex items-center gap-5">
          <Add
            focus={pathname === "/playlists/new"}
            className="size-8 shrink-0"
          />
          <span className="text-header-radio-3 text-black">
            Start a new playlist
          </span>
        </Link>
      </nav>

      {/* Log out */}
      <button
        onClick={handleSignOut}
        className="-ml-2 absolute bottom-[var(--space-page)] left-[var(--space-page)] flex items-center gap-5 cursor-pointer"
      >
        <Logout className="size-8 shrink-0 text-grey" />
        <span className="text-header-radio-3 text-grey">Log out</span>
      </button>
    </aside>
  );
}
