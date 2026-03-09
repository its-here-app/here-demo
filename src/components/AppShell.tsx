"use client";

import { usePathname } from "next/navigation";
import AppBar from "./AppBar";
import { AppBarProvider } from "@/lib/appBarContext";

const AUTH_PATHS = ["/signin"];

export default function AppShell({
  nav,
  children,
}: {
  nav: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuth = AUTH_PATHS.some((p) => pathname.startsWith(p));

  if (isAuth) return <>{children}</>;

  return (
    <div className="flex min-h-screen lg:ml-[var(--sidebar-width)] transition-margin duration-400">
      {nav}
      <div className="flex-1 flex flex-col">
        <AppBarProvider>
          <AppBar />
          <div className="p-[var(--space-page-sm)] lg:p-[var(--space-page)] pb-16 lg:pb-0">
            {children}
          </div>
        </AppBarProvider>
      </div>
    </div>
  );
}
