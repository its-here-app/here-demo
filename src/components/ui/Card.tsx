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
  sm:   "size-[160px]",
  md:   "size-[241px]",
  lg:   "size-[374px]",
  hero: "h-[468px] w-[374px]",
};

export function TextScrim({ size = "hero", children, className }: TextScrimProps) {
  return (
    <div className={`relative overflow-hidden ${scrimDimensions[size]} ${className ?? ""}`}>
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

// ─── Card ─────────────────────────────────────────────────────────────────────

export type CardSize = "hero" | "lg" | "md" | "sm" | "xs" | "xxs" | "nested" | "profile" | "empty";

interface CardProps {
  size?: CardSize;
  image?: string;
  title?: string;
  subtitle?: string;
  badge?: ReactNode;
  sticker?: ReactNode;
  actions?: ReactNode;
  avatar?: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

// Image radius per size
const imageRadius: Record<string, string> = {
  hero:    "rounded-[24px]",
  lg:      "rounded-[16px]",
  md:      "rounded-[12px]",
  sm:      "rounded-[10px]",
  xs:      "rounded-[10px]",
  xxs:     "rounded-[10px]",
  nested:  "rounded-[8px]",
  profile: "rounded-[10px]",
  empty:   "rounded-[16px]",
};

function CardImage({
  src,
  alt = "",
  size,
  className,
}: {
  src?: string;
  alt?: string;
  size: CardSize;
  className?: string;
}) {
  return (
    <div
      className={`bg-black/10 overflow-hidden shrink-0 ${imageRadius[size]} ${className ?? ""}`}
    >
      {src && <img src={src} alt={alt} className="size-full object-cover" />}
    </div>
  );
}

export function Card({
  size = "md",
  image,
  title,
  subtitle,
  badge,
  sticker,
  actions,
  avatar,
  href,
  onClick,
  className,
}: CardProps) {
  const Wrapper = href ? "a" : "div";
  const wrapperProps = href ? { href } : onClick ? { onClick, role: "button" } : {};

  // ── Hero ──────────────────────────────────────────────────────────────────
  if (size === "hero") {
    return (
      <Wrapper
        {...(wrapperProps as Record<string, unknown>)}
        className={`relative bg-black/10 h-[468px] w-[374px] rounded-[24px] overflow-hidden cursor-pointer ${className ?? ""}`}
      >
        {image && (
          <img src={image} alt={title ?? ""} className="absolute inset-0 size-full object-cover" />
        )}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)",
          }}
        />
        {badge && <div className="absolute top-4 left-4">{badge}</div>}
        {sticker && <div className="absolute top-4 right-4">{sticker}</div>}
        {actions && <div className="absolute top-4 right-4 flex gap-2">{actions}</div>}
        {avatar && <div className="absolute top-4 left-4">{avatar}</div>}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          {title && <p className="text-display-crimson-2">{title}</p>}
          {subtitle && <p className="text-body-sm text-white/70 mt-1">{subtitle}</p>}
        </div>
      </Wrapper>
    );
  }

  // ── Large ─────────────────────────────────────────────────────────────────
  if (size === "lg") {
    return (
      <Wrapper
        {...(wrapperProps as Record<string, unknown>)}
        className={`flex flex-col gap-3 w-[374px] cursor-pointer ${className ?? ""}`}
      >
        <div className="relative aspect-square rounded-[16px] overflow-hidden bg-black/10 w-full">
          {image && <img src={image} alt={title ?? ""} className="size-full object-cover" />}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.6) 100%)",
            }}
          />
          {title && (
            <div className="absolute inset-x-0 bottom-1/3 top-1/3 flex items-center justify-center px-8 text-center">
              <p className="text-display-crimson-2 text-neon">{title}</p>
            </div>
          )}
          {actions && <div className="absolute top-4 right-4 flex gap-2">{actions}</div>}
          {badge && <div className="absolute bottom-3 left-1/2 -translate-x-1/2">{badge}</div>}
        </div>
        {subtitle && <p className="text-body-sm text-grey">{subtitle}</p>}
      </Wrapper>
    );
  }

  // ── Medium ────────────────────────────────────────────────────────────────
  if (size === "md") {
    return (
      <Wrapper
        {...(wrapperProps as Record<string, unknown>)}
        className={`flex flex-col gap-3 cursor-pointer ${className ?? ""}`}
      >
        <div className="relative size-[241px] rounded-[12px] overflow-hidden bg-black/10">
          {image && <img src={image} alt={title ?? ""} className="size-full object-cover" />}
          {badge && <div className="absolute top-2 left-2">{badge}</div>}
          {sticker && <div className="absolute top-2 right-2">{sticker}</div>}
          {actions && <div className="absolute top-2 right-2 flex gap-2">{actions}</div>}
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

  // ── Small ─────────────────────────────────────────────────────────────────
  if (size === "sm") {
    return (
      <Wrapper
        {...(wrapperProps as Record<string, unknown>)}
        className={`flex flex-col gap-3 cursor-pointer ${className ?? ""}`}
      >
        <CardImage src={image} alt={title} size="sm" className="size-[160px]" />
        {(title || subtitle) && (
          <div className="flex flex-col gap-0.5 w-[160px]">
            {title && <p className="text-body-sm-bold line-clamp-2">{title}</p>}
            {subtitle && <p className="text-body-xs text-grey">{subtitle}</p>}
          </div>
        )}
      </Wrapper>
    );
  }

  // ── xSmall ────────────────────────────────────────────────────────────────
  if (size === "xs") {
    return (
      <Wrapper
        {...(wrapperProps as Record<string, unknown>)}
        className={`flex items-start justify-between gap-3 w-full cursor-pointer ${className ?? ""}`}
      >
        <div className="flex-1 min-w-0">
          {title && <p className="text-body-sm-bold line-clamp-2">{title}</p>}
          {subtitle && <p className="text-body-xs text-grey mt-0.5">{subtitle}</p>}
        </div>
        <CardImage src={image} alt={title} size="xs" className="size-[80px] shrink-0" />
      </Wrapper>
    );
  }

  // ── xxSmall / Profile ─────────────────────────────────────────────────────
  if (size === "xxs" || size === "profile") {
    return (
      <Wrapper
        {...(wrapperProps as Record<string, unknown>)}
        className={`flex items-center justify-between gap-3 w-full cursor-pointer ${className ?? ""}`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {avatar ?? <CardImage src={image} alt={title} size="xxs" className="size-10 rounded-full" />}
          <div className="flex-1 min-w-0">
            {title && <p className="text-body-sm-bold truncate">{title}</p>}
            {subtitle && <p className="text-body-xs text-grey truncate">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </Wrapper>
    );
  }

  // ── Nested ────────────────────────────────────────────────────────────────
  if (size === "nested") {
    return (
      <Wrapper
        {...(wrapperProps as Record<string, unknown>)}
        className={`bg-black/5 flex items-center justify-between p-2 rounded-[12px] w-full cursor-pointer ${className ?? ""}`}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <CardImage src={image} alt={title} size="nested" className="size-10 shrink-0" />
          <div className="flex-1 min-w-0">
            {title && <p className="text-body-sm-bold truncate">{title}</p>}
            {subtitle && <p className="text-body-xs text-grey truncate">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </Wrapper>
    );
  }

  // ── Empty ─────────────────────────────────────────────────────────────────
  return (
    <div
      className={`flex flex-col items-start size-[374px] ${className ?? ""}`}
      {...(onClick ? { onClick, role: "button" } : {})}
    >
      <div className="aspect-square rounded-[16px] w-full bg-black/5 flex items-center justify-center">
        <p className="text-body-sm text-grey">No image</p>
      </div>
      {(title || subtitle) && (
        <div className="flex flex-col gap-0.5 mt-3">
          {title && <p className="text-body-sm-bold">{title}</p>}
          {subtitle && <p className="text-body-xs text-grey">{subtitle}</p>}
        </div>
      )}
    </div>
  );
}
