"use client";

import { useAppBar } from "@/lib/appBarContext";

export default function AppBar() {
  const { state } = useAppBar();

  if (state.hidden || (!state.left && !state.center && !state.right)) {
    return null;
  }

  return (
    <div className="flex items-center px-[var(--space-page-sm)] lg:px-[var(--space-page)] lg:pt-12 h-14">
      <div className="flex-1 flex items-center justify-start">{state.left}</div>
      <div className="flex-1 flex items-center justify-center">{state.center}</div>
      <div className="flex-1 flex items-center justify-end">{state.right}</div>
    </div>
  );
}
