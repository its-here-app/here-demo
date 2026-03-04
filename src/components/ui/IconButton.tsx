import type { ButtonHTMLAttributes, ReactNode } from "react";

export type IconButtonVariant = "primary" | "secondary" | "tertiary" | "brand" | "hero" | "overlay";
export type IconButtonSize = "default" | "lg";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  icon: ReactNode;
  label?: string;
}

function variantClasses(variant: IconButtonVariant): string {
  switch (variant) {
    case "primary":   return "bg-black text-white";
    case "secondary": return "bg-black/5 text-black";
    case "tertiary":  return "border border-black/10 text-black";
    case "brand":     return "bg-neon text-black";
    case "hero":      return "bg-black text-white";
    case "overlay":   return "backdrop-blur-sm bg-white/20 text-white";
  }
}

export function IconButton({
  variant = "primary",
  size = "default",
  icon,
  label,
  className,
  ...rest
}: IconButtonProps) {
  const isHero = variant === "hero";

  // Hero is a wide pill shape; all others are square-ish circles
  const shapeClasses = isHero
    ? "h-11 w-16 px-5 py-2.5 rounded-full"
    : size === "lg"
    ? "size-[54px] rounded-[30px]"
    : "size-9 rounded-[30px]";

  return (
    <button
      aria-label={label}
      className={`inline-flex items-center justify-center shrink-0 cursor-pointer transition-opacity hover:opacity-80 active:opacity-70 disabled:opacity-40 disabled:cursor-not-allowed ${shapeClasses} ${variantClasses(variant)} ${className ?? ""}`}
      {...rest}
    >
      <span className="size-6 flex items-center justify-center">{icon}</span>
    </button>
  );
}
