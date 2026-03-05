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

  if (loading || !user) return null;

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  const profileHref = username ? `/${username}` : "/";

  return (
    <aside className="hidden lg:flex flex-col w-[270px] shrink-0 min-h-screen bg-white relative">
      {/* Logo */}
      <div className="px-8 pt-8">
        <FullLogo className="w-20" />
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-8 mt-[80px] px-6">
        <Link href="/saves" className="flex items-center gap-5">
          <Bookmark
            active={pathname === "/saves"}
            className="size-8 shrink-0 text-black"
          />
          <span className="text-[18px] leading-normal font-radio text-black">
            Saves
          </span>
        </Link>

        <Link href={profileHref} className="flex items-center gap-5">
          <span className="size-8 shrink-0 flex items-center justify-center">
            <Avatar
              src={avatarUrl}
              alt="Profile"
              focus={pathname === profileHref}
            />
          </span>
          <span className="text-[18px] leading-normal font-radio text-black">
            Profile
          </span>
        </Link>

        <div className="border-t border-black/10 w-full" />

        <Link href="/playlists/new" className="flex items-center gap-5">
          <Add focus={pathname === "/playlists/new"} className="size-8 shrink-0" />
          <span className="text-[18px] leading-normal font-radio text-black">
            Start a new playlist
          </span>
        </Link>
      </nav>

      {/* Log out */}
      <button
        onClick={handleSignOut}
        className="absolute bottom-7 left-6 flex items-center gap-5 cursor-pointer"
      >
        <Logout className="size-8 shrink-0 text-grey" />
        <span className="text-[18px] leading-normal font-radio text-grey">
          Log out
        </span>
      </button>
    </aside>
  );
}
