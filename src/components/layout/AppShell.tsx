"use client";

import { usePathname } from "next/navigation";
import AppBar from "./AppBar";
import { AppBarProvider } from "@/lib/appBarContext";
import { useAuth } from "@/lib/authContext";

const AUTH_PATHS = ["/signin"];

export default function AppShell({
  nav,
  children,
  initialLoggedIn,
}: {
  nav: React.ReactNode;
  children: React.ReactNode;
  initialLoggedIn?: boolean;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAuth = AUTH_PATHS.some((p) => pathname.startsWith(p));

  if (isAuth) return <div className="bg-surface-base dark min-h-screen">{children}</div>;

  const showSidebar = initialLoggedIn || !!user;

  return (
    <div
      className={`flex min-h-screen transition-margin duration-400 max-w-[var(--app-max-width)] mx-auto ${showSidebar ? " lg:pl-[var(--sidebar-width)]" : ""}`}
    >
      {user && nav}
      <div className="flex-1 flex flex-col">
        <AppBarProvider>
          <AppBar />
          <div
            className={`px-[var(--space-page-dynamic)] pt-[var(--space-page-md)] ${!showSidebar ? " w-full max-w-[calc(var(--app-max-width)-var(--sidebar-width))] mx-auto" : ""} ${user ? "pb-[calc(var(--space-page-sm)+var(--bottomnav-height))] lg:pb-[var(--space-page-dynamic)]" : "pb-[var(--space-page-dynamic)]"}`}
          >
            {children}
          </div>
        </AppBarProvider>
      </div>
    </div>
  );
}
