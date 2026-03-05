import type { ReactNode } from "react";
import { FullLogo } from "./Logo";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TopNavVariant =
  | "logo-location" // Logo left, city pill right
  | "logged-out" // Logo left, Sign in button right
  | "logo-only" // Logo left only
  | "child" // Back left, Title center, optional right action
  | "profile"; // Icon left, Title center, Icon right

interface TopNavigationProps {
  variant?: TopNavVariant;
  /** Controls logo color — use "dark" on black backgrounds */
  theme?: "light" | "dark";
  /** City name shown in logo-location variant */
  city?: string;
  /** Title shown in child and profile variants */
  title?: string;
  /** Left slot — rendered in child and profile variants */
  leftAction?: ReactNode;
  /** Right slot — rendered in child, profile, logged-out, and logo-location variants */
  rightAction?: ReactNode;
  className?: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function MapPinIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 1.5C5.79 1.5 4 3.29 4 5.5C4 8.5 8 14 8 14C8 14 12 8.5 12 5.5C12 3.29 10.21 1.5 8 1.5ZM8 7.25C7.03 7.25 6.25 6.47 6.25 5.5C6.25 4.53 7.03 3.75 8 3.75C8.97 3.75 9.75 4.53 9.75 5.5C9.75 6.47 8.97 7.25 8 7.25Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TopNavigation({
  variant = "logo-only",
  theme = "light",
  city = "Los Angeles",
  title,
  leftAction,
  rightAction,
  className,
}: TopNavigationProps) {
  const isDark = theme === "dark";
  const logoClass = isDark ? "brightness-0 invert" : "";
  const textColor = isDark ? "text-white" : "text-black";

  // Child — back left, title centered, optional right action
  if (variant === "child") {
    return (
      <div
        className={`relative flex items-center justify-between px-[var(--space-page)] h-14 pb-2 pt-3 ${className ?? ""}`}
      >
        <div className="w-[67px] shrink-0">{leftAction}</div>
        {title && (
          <p
            className={`text-body-sm-bold absolute left-1/2 -translate-x-1/2 ${textColor}`}
          >
            {title}
          </p>
        )}
        <div className="w-[67px] shrink-0 flex justify-end">{rightAction}</div>
      </div>
    );
  }

  // Profile — icon left, small title centered, icon right
  if (variant === "profile") {
    return (
      <div
        className={`relative flex items-center justify-between px-[var(--space-page)] h-14 pb-2 pt-3 ${className ?? ""}`}
      >
        <div className="size-6 shrink-0 flex items-center">{leftAction}</div>
        {title && (
          <p
            className={`text-body-xs absolute left-1/2 -translate-x-1/2 ${textColor} opacity-60`}
          >
            {title}
          </p>
        )}
        <div className="size-6 shrink-0 flex items-center justify-end">
          {rightAction}
        </div>
      </div>
    );
  }

  // Logo-based variants (logo-only, logo-location, logged-out)
  return (
    <div
      className={`flex items-center justify-between px-[var(--space-page)] pt-6  lg:pt-[var(--space-page)] ${className ?? ""}`}
    >
      <FullLogo color={isDark ? "white" : "black"} className="w-20" />

      {variant === "logo-location" && (
        <button
          type="button"
          className={`flex items-center gap-1 bg-black/[0.06] rounded-full px-3 h-9 text-body-sm ${textColor} transition-opacity hover:opacity-70`}
        >
          <MapPinIcon />
          <span>{city}</span>
        </button>
      )}

      {variant === "logged-out" && (
        <button
          type="button"
          className={`text-body-sm-bold px-[var(--space-page)] h-9 transition-opacity hover:opacity-70 ${textColor}`}
        >
          {rightAction ?? "Sign in"}
        </button>
      )}

      {variant === "logo-only" && rightAction}
    </div>
  );
}
