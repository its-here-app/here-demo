"use client";

import { useAppBar } from "@/lib/appBarContext";

export default function AppBar() {
  const { state } = useAppBar();

  if (state.hidden) return null;

  return (
    <div className="flex items-center mx-[var(--space-page-sm)] lg:mx-[var(--space-page-dynamic)] mt-[var(--space-page-sm)] lg:mt-[var(--space-page-dynamic)] h-9">
      <div className="flex-1 flex items-center justify-start">{state.left}</div>
      <div className="flex-1 flex items-center justify-center">
        {state.center}
      </div>
      <div className="flex-1 flex items-center justify-end">{state.right}</div>
    </div>
  );
}
