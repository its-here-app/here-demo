"use client";

import type { ReactNode } from "react";

interface TabProps {
  title: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export function Tab({ title, icon, active = false, onClick }: TabProps) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`flex-1 flex flex-col items-center mb-[-1px] gap-0.5 py-2 border-b cursor-pointer transition-colors ${
        active
          ? "border-white text-white"
          : "border-transparent text-white/40 hover:text-white/70"
      }`}
    >
      {icon && (
        <span className="size-6 flex items-center justify-center">{icon}</span>
      )}
      <span className="text-body-xs">{title}</span>
    </button>
  );
}

interface TabsProps {
  children: ReactNode;
  className?: string;
}

export function Tabs({ children, className }: TabsProps) {
  return (
    <div
      role="tablist"
      className={`flex w-full border-b border-white/20 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
