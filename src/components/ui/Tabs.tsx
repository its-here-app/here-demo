"use client";

import { Children, isValidElement, type ReactNode } from "react";

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
      className={`flex-1 flex flex-col items-center gap-0.5 py-2 cursor-pointer transition-colors ${
        active
          ? "text-primary"
          : "text-primary/40 hover:text-primary/70"
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
  const tabs = Children.toArray(children);
  const count = tabs.length;
  const activeIndex = tabs.findIndex(
    (tab) => isValidElement(tab) && (tab.props as TabProps).active
  );

  return (
    <div
      role="tablist"
      className={`relative flex w-full border-b border-subtle ${className ?? ""}`}
    >
      {children}
      {activeIndex >= 0 && count > 0 && (
        <div
          className="absolute bottom-[-1px] h-[1px] bg-primary transition-transform duration-300 ease-in-out"
          style={{
            width: `${100 / count}%`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
      )}
    </div>
  );
}
