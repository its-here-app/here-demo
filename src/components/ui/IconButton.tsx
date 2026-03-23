import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

export type IconButtonVariant = "primary" | "secondary" | "tertiary" | "brand" | "hero" | "overlay" | "ghost";
export type IconButtonSize = "default" | "lg";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  icon: ReactNode;
  label?: string;
  href?: string;
  mobileTransparent?: boolean;
}

function variantClasses(variant: IconButtonVariant, mobileTransparent?: boolean): string {
  switch (variant) {
    case "primary":   return "bg-black text-white";
    case "secondary": return mobileTransparent ? "bg-transparent lg:bg-grey-300 text-black" : "bg-grey-300 text-black";
    case "tertiary":  return "border border-black/10 text-black";
    case "brand":     return "bg-neon text-black";
    case "hero":      return "bg-black text-white";
    case "overlay":   return "backdrop-blur-sm bg-white/20 text-white";
    case "ghost":     return "text-primary";
  }
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ variant = "primary", size = "default", icon, label, href, mobileTransparent, className, ...rest }, ref) {
    const isHero = variant === "hero";

    const shapeClasses = isHero
      ? "h-11 w-16 px-5 py-2.5 rounded-full"
      : size === "lg"
      ? "size-[3.375rem] rounded-[1.875rem]"
      : "size-9 rounded-[1.875rem]";

    const classes = `inline-flex items-center justify-center shrink-0 cursor-pointer transition-opacity hover:opacity-80 active:opacity-70 disabled:opacity-40 disabled:cursor-not-allowed ${shapeClasses} ${variantClasses(variant, mobileTransparent)} ${className ?? ""}`;
    const content = <span className="size-6 flex items-center justify-center">{icon}</span>;

    if (href) {
      return (
        <Link href={href} aria-label={label} className={classes}>
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        aria-label={label}
        className={classes}
        {...rest}
      >
        {content}
      </button>
    );
  }
);
