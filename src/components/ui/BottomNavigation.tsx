import type { ReactNode } from "react";
import { Avatar } from "./Avatar";
import { Bookmark } from "./icons/Bookmark";
import { Home } from "./icons/Home";
import { Plus } from "./icons/Plus";
import { Search } from "./icons/Search";
import { IconButton } from "./IconButton";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BottomNavTab = "home" | "search" | "saved" | "profile";

interface BottomNavigationProps {
  /** Active tab — controls which icon is filled */
  activeTab?: BottomNavTab;
  /** Called when the + add button is pressed */
  onAdd?: () => void;
  /** Called when a tab icon is pressed */
  onTabChange?: (tab: BottomNavTab) => void;
  /** Avatar image URL — shown in the profile slot */
  avatarUrl?: string;
  className?: string;
}

function NavButton({
  active = false,
  onClick,
  children,
  label,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className="size-8 flex items-center justify-center transition-opacity hover:opacity-70"
    >
      {children}
    </button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BottomNavigation({
  activeTab,
  onAdd,
  onTabChange,
  avatarUrl,
  className,
}: BottomNavigationProps) {
  return (
    <div
      className={`bg-surface-base py-2 shadow-[0px_-4px_14px_0px_rgba(0,0,0,0.05)] ${className ?? ""}`}
    >
      <div className="flex items-center justify-evenly max-w-md mx-auto">
        <NavButton label="Home" onClick={() => onTabChange?.("home")}>
          <Home focus={activeTab === "home"} className="size-8" />
        </NavButton>
        <NavButton label="Search" onClick={() => onTabChange?.("search")}>
          <Search focus={activeTab === "search"} className="size-8" />
        </NavButton>
        <IconButton
          variant="hero"
          icon={<Plus className="size-6" />}
          label="Add"
          onClick={onAdd}
        />
        <NavButton label="Saved" onClick={() => onTabChange?.("saved")}>
          <Bookmark active={activeTab === "saved"} className="size-8" />
        </NavButton>
        <button
          type="button"
          onClick={() => onTabChange?.("profile")}
          aria-label="Profile"
          className="transition-opacity hover:opacity-70"
        >
          <Avatar
            src={avatarUrl}
            focus={activeTab === "profile"}
            size="md"
            className="mt-2"
          />
        </button>
      </div>
    </div>
  );
}
