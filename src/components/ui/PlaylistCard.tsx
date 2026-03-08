import type { ReactNode } from "react";

// ─── TextScrim ────────────────────────────────────────────────────────────────
// Gradient overlay for text legibility on card images.

export type TextScrimSize = "sm" | "md" | "lg" | "hero";
export type TextScrimType = "city" | "playlist" | "playlist-edit" | "spot";

interface TextScrimProps {
  size?: TextScrimSize;
  type?: TextScrimType;
  children?: ReactNode;
  className?: string;
}

const scrimDimensions: Record<TextScrimSize, string> = {
  sm: "size-[10rem]",
  md: "size-[15.0625rem]",
  lg: "size-[23.375rem]",
  hero: "h-[29.25rem] w-[23.375rem]",
};

export function TextScrim({
  size = "hero",
  children,
  className,
}: TextScrimProps) {
  return (
    <div
      className={`relative overflow-hidden ${scrimDimensions[size]} ${className ?? ""}`}
    >
      {children}
      <div
        className="absolute inset-0 mix-blend-soft-light pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </div>
  );
}

// ─── PlaylistCard ─────────────────────────────────────────────────────────────

export type PlaylistCardSize = "hero" | "lg" | "md" | "sm" | "empty";

interface PlaylistCardProps {
  size?: PlaylistCardSize;
  image?: string;
  city?: string;
  playlistName?: string;
  title?: string;
  subtitle?: string;
  /** Overlay action slots */
  topLeft?: ReactNode;
  topCenter?: ReactNode;
  topRight?: ReactNode;
  bottomLeft?: ReactNode;
  bottomCenter?: ReactNode;
  bottomRight?: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

function TopActions({
  left,
  center,
  right,
  padding,
}: {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  padding: string;
}) {
  if (!left && !center && !right) return null;
  return (
    <div
      className={`absolute top-0 inset-x-0 grid grid-cols-3 items-center ${padding}`}
    >
      <div className="flex justify-start">{left}</div>
      <div className="flex justify-center">{center}</div>
      <div className="flex justify-end">{right}</div>
    </div>
  );
}

function BottomActions({
  left,
  center,
  right,
  padding,
}: {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  padding: string;
}) {
  if (!left && !center && !right) return null;
  return (
    <div
      className={`absolute bottom-0 inset-x-0 grid grid-cols-3 items-center ${padding}`}
    >
      <div className="flex justify-start">{left}</div>
      <div className="flex justify-center">{center}</div>
      <div className="flex justify-end">{right}</div>
    </div>
  );
}

const imageHeight: Record<PlaylistCardSize, string> = {
  hero: "h-[30rem] lg:h-full",
  lg: "aspect-square",
  md: "aspect-square",
  sm: "aspect-square",
  empty: "aspect-square",
};

const imageRadius: Record<PlaylistCardSize, string> = {
  hero: "rounded-lg",
  lg: "rounded-md",
  md: "rounded-sm",
  sm: "rounded-sm",
  empty: "rounded-sm",
};

const actionPadding: Record<PlaylistCardSize, string> = {
  hero: "p-4",
  lg: "p-4",
  md: "p-2",
  sm: "p-2",
  empty: "p-2",
};

export function PlaylistCard({
  size = "md",
  image,
  city,
  playlistName,
  title,
  subtitle,
  topLeft,
  topCenter,
  topRight,
  bottomLeft,
  bottomCenter,
  bottomRight,
  href,
  onClick,
  className,
}: PlaylistCardProps) {
  // ── Empty ─────────────────────────────────────────────────────────────────
  if (size === "empty") {
    return (
      <div
        className={`flex flex-col w-full ${onClick ? "cursor-pointer" : ""} ${className ?? ""}`}
        {...(onClick ? { onClick, role: "button" } : {})}
      >
        <div className="aspect-square rounded-sm w-full bg-black/5 flex items-center justify-center">
          <p className="text-body-sm text-grey">No image</p>
        </div>
        {(title || subtitle) && (
          <div className="flex flex-col gap-0.5 mt-3">
            {title && <p className="text-display-golos-3">{title}</p>}
            {subtitle && <p className="text-body-sm text-grey">{subtitle}</p>}
          </div>
        )}
      </div>
    );
  }

  const Wrapper = href ? "a" : "div";
  const wrapperProps = href
    ? { href }
    : onClick
      ? { onClick, role: "button" }
      : {};

  return (
    <Wrapper
      {...(wrapperProps as Record<string, unknown>)}
      className={`flex flex-col gap-3 w-full cursor-pointer ${className ?? ""}`}
    >
      <div
        className={`relative overflow-hidden bg-black/10 w-full ${imageHeight[size]} ${imageRadius[size]}`}
      >
        {image && (
          <img
            src={image}
            alt={city ?? title ?? ""}
            className="absolute inset-0 size-full object-cover"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.6) 100%)",
          }}
        />
        {city && (
          <div className="absolute inset-x-0 bottom-1/3 top-1/3 flex flex-col items-center justify-center px-8 text-center text-neon">
            <p className="text-display-crimson-2">{city}</p>
            {playlistName && (
              <p className="text-display-golos-1">{playlistName}</p>
            )}
          </div>
        )}
        <TopActions
          left={topLeft}
          center={topCenter}
          right={topRight}
          padding={actionPadding[size]}
        />
        <BottomActions
          left={bottomLeft}
          center={bottomCenter}
          right={bottomRight}
          padding={actionPadding[size]}
        />
      </div>
      {(title || subtitle) && (
        <div className="flex flex-col gap-0.5">
          {title && <p className="text-display-golos-3">{title}</p>}
          {subtitle && <p className="text-body-sm text-grey">{subtitle}</p>}
        </div>
      )}
    </Wrapper>
  );
}
