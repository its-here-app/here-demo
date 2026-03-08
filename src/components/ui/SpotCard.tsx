import type { ReactNode } from "react";

// ─── SpotCard ─────────────────────────────────────────────────────────────────

export type SpotCardSize = "xs" | "xxs" | "profile" | "nested";

interface SpotCardProps {
  size?: SpotCardSize;
  image?: string;
  title?: string;
  subtitle?: string;
  /** Right-side action slot — xxs, profile, nested only */
  actions?: ReactNode;
  /** Avatar override — xxs, profile only */
  avatar?: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

const imageRadius: Record<SpotCardSize, string> = {
  xs: "rounded-[0.625rem]",
  xxs: "rounded-[0.625rem]",
  profile: "rounded-[0.625rem]",
  nested: "rounded-[0.5rem]",
};

function CardImage({
  src,
  alt = "",
  size,
  className,
}: {
  src?: string;
  alt?: string;
  size: SpotCardSize;
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

export function SpotCard({
  size = "xxs",
  image,
  title,
  subtitle,
  actions,
  avatar,
  href,
  onClick,
  className,
}: SpotCardProps) {
  const Wrapper = href ? "a" : "div";
  const wrapperProps = href
    ? { href }
    : onClick
      ? { onClick, role: "button" }
      : {};

  // ── xSmall ────────────────────────────────────────────────────────────────
  if (size === "xs") {
    return (
      <Wrapper
        {...(wrapperProps as Record<string, unknown>)}
        className={`flex items-start justify-between gap-3 w-full cursor-pointer ${className ?? ""}`}
      >
        <div className="flex-1 min-w-0">
          {title && <p className="text-body-sm-bold line-clamp-2">{title}</p>}
          {subtitle && (
            <p className="text-body-xs text-grey mt-0.5">{subtitle}</p>
          )}
        </div>
        <CardImage
          src={image}
          alt={title}
          size="xs"
          className="size-[5rem] shrink-0"
        />
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
          {avatar ?? (
            <CardImage
              src={image}
              alt={title}
              size="xxs"
              className="size-10 rounded-full"
            />
          )}
          <div className="flex-1 min-w-0">
            {title && <p className="text-body-sm-bold truncate">{title}</p>}
            {subtitle && (
              <p className="text-body-xs text-grey truncate">{subtitle}</p>
            )}
          </div>
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </Wrapper>
    );
  }

  // ── Nested ────────────────────────────────────────────────────────────────
  return (
    <Wrapper
      {...(wrapperProps as Record<string, unknown>)}
      className={`bg-black/5 flex items-center justify-between p-2 rounded-[0.75rem] w-full cursor-pointer ${className ?? ""}`}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <CardImage
          src={image}
          alt={title}
          size="nested"
          className="size-10 shrink-0"
        />
        <div className="flex-1 min-w-0">
          {title && <p className="text-body-sm-bold truncate">{title}</p>}
          {subtitle && (
            <p className="text-body-xs text-grey truncate">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </Wrapper>
  );
}
