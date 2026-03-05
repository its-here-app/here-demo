import type { ReactNode } from "react";
import { Bookmark } from "./icons/Bookmark";
import { Home } from "./icons/Home";
import { Search } from "./icons/Search";
import { Plus } from "./icons/Plus";
import { IconButton } from "./IconButton";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BottomNavTab = "home" | "search" | "saved" | "profile";

interface BottomNavigationProps {
  /** Active tab — controls which icon is filled */
  activeTab?: BottomNavTab;
  /** Shows full tab bar (home, search, add, bookmark, avatar). When false, shows add + avatar only. */
  loggedIn?: boolean;
  /** Shows simplified demo variant: bookmark + add + avatar */
  demo?: boolean;
  /** Called when the + add button is pressed */
  onAdd?: () => void;
  /** Called when a tab icon is pressed */
  onTabChange?: (tab: BottomNavTab) => void;
  /** Avatar image URL — shown in the profile slot */
  avatarUrl?: string;
  className?: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function Avatar({ src, active }: { src?: string; active?: boolean }) {
  return (
    <div
      className={`relative size-7 rounded-full shrink-0 ${
        active ? "outline outline-1 -outline-offset-1 outline-black" : ""
      }`}
    >
      {src && (
        <img
          src={src}
          alt="Profile"
          className="absolute size-[22px] rounded-full object-cover top-[3px] left-1/2 -translate-x-1/2"
        />
      )}
    </div>
  );
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
  loggedIn = true,
  demo = false,
  onAdd,
  onTabChange,
  avatarUrl,
  className,
}: BottomNavigationProps) {
  const addButton = (
    <IconButton
      variant="hero"
      icon={<Plus className="size-6" />}
      label="Add"
      onClick={onAdd}
    />
  );

  // Demo: bookmark + add + avatar
  if (demo) {
    return (
      <div
        className={`bg-white flex items-center justify-center gap-[72px] px-10 py-2 shadow-[0px_-4px_14px_0px_rgba(0,0,0,0.05)] ${className ?? ""}`}
      >
        <NavButton label="Saved" onClick={() => onTabChange?.("saved")}>
          <Bookmark active={activeTab === "saved"} />
        </NavButton>
        {addButton}
        <button
          type="button"
          onClick={() => onTabChange?.("profile")}
          aria-label="Profile"
          className="transition-opacity hover:opacity-70"
        >
          <Avatar src={avatarUrl} active={activeTab === "profile"} />
        </button>
      </div>
    );
  }

  // Minimal / logged-out: just add + avatar
  if (!loggedIn) {
    return (
      <div
        className={`bg-white flex items-center justify-center gap-[72px] px-10 py-2 shadow-[0px_-4px_14px_0px_rgba(0,0,0,0.05)] ${className ?? ""}`}
      >
        {addButton}
        <Avatar src={avatarUrl} />
      </div>
    );
  }

  // Full logged-in tab bar
  return (
    <div
      className={`bg-white flex items-center justify-between px-10 py-2 shadow-[0px_-4px_14px_0px_rgba(0,0,0,0.05)] ${className ?? ""}`}
    >
      <NavButton
        active={activeTab === "home"}
        onClick={() => onTabChange?.("home")}
        label="Home"
      >
        <Home focus={activeTab === "home"} />
      </NavButton>

      <NavButton
        active={activeTab === "search"}
        onClick={() => onTabChange?.("search")}
        label="Search"
      >
        <Search active={activeTab === "search"} />
      </NavButton>

      {addButton}

      <NavButton
        active={activeTab === "saved"}
        onClick={() => onTabChange?.("saved")}
        label="Saved"
      >
        <Bookmark active={activeTab === "saved"} />
      </NavButton>

      <button
        type="button"
        onClick={() => onTabChange?.("profile")}
        aria-label="Profile"
        aria-current={activeTab === "profile" ? "page" : undefined}
        className="transition-opacity hover:opacity-70"
      >
        <Avatar src={avatarUrl} active={activeTab === "profile"} />
      </button>
    </div>
  );
}
