"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { signOut, getUserUsername } from "@/lib/services/users";

export default function Sidebar() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getUserUsername(user.id).then(setUsername);
  }, [user]);

  if (loading || !user) return null;

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  function navClass(href: string) {
    const active = pathname === href;
    return `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-gray-100 text-gray-900"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
    }`;
  }

  return (
    <aside className="w-56 shrink-0 min-h-screen border-r border-gray-200 flex flex-col p-4">
      <nav className="flex-1 flex flex-col gap-1">
        <Link href={username ? `/${username}` : "/"} className={navClass(username ? `/${username}` : "/")}>
          Home
        </Link>
        <Link href="/saves" className={navClass("/saves")}>
          Saves
        </Link>
        <Link href="/playlists/new" className={navClass("/playlists/new")}>
          + New playlist
        </Link>
      </nav>

      <button
        onClick={handleSignOut}
        className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
      >
        Log out
      </button>
    </aside>
  );
}
