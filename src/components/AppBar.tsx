"use client";

import { useAppBar } from "@/lib/appBarContext";

export default function AppBar() {
  const { state } = useAppBar();

  if (state.hidden || (!state.left && !state.center && !state.right)) {
    return null;
  }

  return (
    <div className="relative flex items-center px-[var(--space-page-sm)] lg:px-[var(--space-page)] lg:pt-12 h-14 pb-2 pt-3">
      {state.left && <div className="shrink-0">{state.left}</div>}
      {state.center && (
        <div className="absolute left-1/2 -translate-x-1/2">{state.center}</div>
      )}
      {state.right && <div className="shrink-0 ml-auto">{state.right}</div>}
    </div>
  );
}
