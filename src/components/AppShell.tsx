"use client";

import { usePathname } from "next/navigation";

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
    <div className="flex min-h-screen">
      {nav}
      <div className="flex-1 pt-14 lg:pt-0 pb-16 lg:pb-0">{children}</div>
    </div>
  );
}
