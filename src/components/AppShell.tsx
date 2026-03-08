"use client";

import { usePathname } from "next/navigation";
import AppBar from "./AppBar";
import { AppBarProvider } from "@/lib/appBarContext";

const AUTH_PATHS = ["/signin"];
const NO_SIDEBAR_PATHS = ["/playlists"];

export default function AppShell({
  nav,
  children,
}: {
  nav: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuth = AUTH_PATHS.some((p) => pathname.startsWith(p));
  const hideSidebar = NO_SIDEBAR_PATHS.some((p) => pathname.startsWith(p));

  if (isAuth) return <>{children}</>;

  return (
    <div className={`flex min-h-screen transition-[margin] duration-400 ${hideSidebar ? "" : "lg:ml-[var(--sidebar-width)]"}`}>
      {!hideSidebar && nav}
      <div className="flex-1 flex flex-col">
        <AppBarProvider>
          <AppBar />
          <div className="p-[var(--space-page-sm)] pb-16 lg:pb-0">
            {children}
          </div>
        </AppBarProvider>
      </div>
    </div>
  );
}
