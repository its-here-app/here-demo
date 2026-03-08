import type { ReactNode } from "react";
import Link from "next/link";
import { FullLogo } from "./Logo";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NavBarVariant =
  | "logo-location" // Logo left, city pill right
  | "logged-out" // Logo left, Sign in button right
  | "logo-only"; // Logo left only

interface NavBarProps {
  variant?: NavBarVariant;
  /** Controls logo color — use "dark" on black backgrounds */
  theme?: "light" | "dark";
  /** City name shown in logo-location variant */
  city?: string;
  /** Left slot — rendered in slot layout (no variant) */
  left?: ReactNode;
  /** Center slot — absolutely centered in slot layout (no variant) */
  center?: ReactNode;
  /** Right slot — rendered in logo and slot layouts */
  right?: ReactNode;
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

export function NavBar({
  variant,
  theme = "light",
  city = "Los Angeles",
  left,
  center,
  right,
  className,
}: NavBarProps) {
  const isDark = theme === "dark";
  const textColor = isDark ? "text-white" : "text-black";

  // Logo-based variants (logo-only, logo-location, logged-out)
  if (
    variant === "logo-location" ||
    variant === "logged-out" ||
    variant === "logo-only"
  ) {
    return (
      <div
        className={`flex items-center justify-between px-[var(--space-page-sm)] pt-6 lg:pt-[var(--space-page)] ${className ?? ""}`}
      >
        <Link href="/" className="cursor-pointer">
          <FullLogo
            color={isDark ? "white" : "black"}
            className="h-5 w-auto lg:h-auto lg:w-20 transition-[height,width] duration-200 ease-in-out"
          />
        </Link>

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
            className={`text-body-sm-bold px-[var(--space-page-sm)] h-9 transition-opacity hover:opacity-70 ${textColor}`}
          >
            {right ?? "Sign in"}
          </button>
        )}

        {variant === "logo-only" && right}
      </div>
    );
  }

  // Generic slot layout — left, absolutely-centered center, right
  return (
    <div
      className={`relative flex items-center px-[var(--space-page-sm)] ${className ?? ""}`}
    >
      {left && <div className="shrink-0">{left}</div>}
      {center && (
        <div className="absolute left-1/2 -translate-x-1/2">{center}</div>
      )}
      {right && <div className="shrink-0 ml-auto">{right}</div>}
    </div>
  );
}
