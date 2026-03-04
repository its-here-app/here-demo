import type { ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BottomNavTab = "home" | "search" | "saved" | "profile";

interface BottomNavigationProps {
  /** Active tab — controls which icon is filled */
  activeTab?: BottomNavTab;
  /** Shows full tab bar (home, search, add, bookmark, avatar). When false, shows add + avatar only. */
  loggedIn?: boolean;
  /** Called when the + add button is pressed */
  onAdd?: () => void;
  /** Called when a tab icon is pressed */
  onTabChange?: (tab: BottomNavTab) => void;
  /** Avatar image URL — shown in the profile slot */
  avatarUrl?: string;
  className?: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      {active ? (
        <path d="M2 9.5L11 2L20 9.5V20H14V13H8V20H2V9.5Z" fill="black" />
      ) : (
        <path
          d="M2 9.5L11 2L20 9.5V20H14V13H8V20H2V9.5Z"
          stroke="black"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function SearchIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle
        cx="9.5"
        cy="9.5"
        r="6"
        stroke="black"
        strokeWidth={active ? 2 : 1.5}
        fill="none"
      />
      <path
        d="M14 14L19 19"
        stroke="black"
        strokeWidth={active ? 2 : 1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

function BookmarkIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      {active ? (
        <path d="M4 2H18V21L11 17L4 21V2Z" fill="black" />
      ) : (
        <path
          d="M4 2H18V21L11 17L4 21V2Z"
          stroke="black"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Avatar({ src, active }: { src?: string; active?: boolean }) {
  return (
    <div
      className={`size-7 rounded-full overflow-hidden shrink-0 ${
        active ? "ring-2 ring-black ring-offset-1" : ""
      } bg-black/10`}
    >
      {src && <img src={src} alt="Profile" className="size-full object-cover" />}
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
  onAdd,
  onTabChange,
  avatarUrl,
  className,
}: BottomNavigationProps) {
  const addButton = (
    <button
      type="button"
      onClick={onAdd}
      aria-label="Add"
      className="h-11 w-16 bg-black rounded-full flex items-center justify-center transition-opacity hover:opacity-80 active:opacity-70"
    >
      <PlusIcon />
    </button>
  );

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
        <HomeIcon active={activeTab === "home"} />
      </NavButton>

      <NavButton
        active={activeTab === "search"}
        onClick={() => onTabChange?.("search")}
        label="Search"
      >
        <SearchIcon active={activeTab === "search"} />
      </NavButton>

      {addButton}

      <NavButton
        active={activeTab === "saved"}
        onClick={() => onTabChange?.("saved")}
        label="Saved"
      >
        <BookmarkIcon active={activeTab === "saved"} />
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
