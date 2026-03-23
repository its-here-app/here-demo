"use client";

import { Children, isValidElement, type ReactNode } from "react";

interface TabPanelsProps {
  activeIndex: number;
  children: ReactNode;
  className?: string;
}

export function TabPanels({ activeIndex, children, className }: TabPanelsProps) {
  const panels = Children.toArray(children);
  const count = panels.length;
  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <div
        className="flex transition-transform duration-400 ease-in-out"
        style={{
          width: `${count * 100}%`,
          transform: `translateX(${-(activeIndex * 100) / count}%)`,
        }}
      >
        {panels.map((panel, i) => (
          <div key={i} style={{ width: `${100 / count}%` }} className="min-w-0">
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
}

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
          : "text-tertiary hover:text-secondary"
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
      className={`relative flex w-full ${className ?? ""}`}
    >
      {children}
      {activeIndex >= 0 && count > 0 && (
        <div
          className="absolute bottom-[-1px] h-[1px] bg-[var(--border-strong)] transition-transform duration-300 ease-in-out"
          style={{
            width: `${100 / count}%`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
      )}
    </div>
  );
}
