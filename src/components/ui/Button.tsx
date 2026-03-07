import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "filled" | "tonal" | "outline" | "text" | "overlay";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  darkTheme?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 py-2 gap-1 rounded-[0.5rem] text-body-xs",
  md: "h-9 px-[0.875rem] py-[0.625rem] gap-1 rounded-[0.5rem] text-body-xs",
  lg: "h-[3.125rem] px-5 py-[1.125rem] gap-1.5 rounded-[1rem] text-body-sm",
};

function variantClasses(variant: ButtonVariant, darkTheme: boolean): string {
  if (variant === "overlay") {
    return "backdrop-blur-sm bg-white/20 text-white rounded-full px-3 py-1.5";
  }
  if (!darkTheme) {
    switch (variant) {
      case "filled":  return "bg-black text-white";
      case "tonal":   return "bg-black/[0.06] text-black";
      case "outline": return "border border-black/10 text-black";
      case "text":    return "text-black";
    }
  } else {
    switch (variant) {
      case "filled":  return "bg-white text-black";
      case "tonal":   return "bg-white/15 text-white";
      case "outline": return "border border-white/15 text-white";
      case "text":    return "text-white";
    }
  }
}

export function Button({
  variant = "filled",
  size = "md",
  darkTheme = false,
  leftIcon,
  rightIcon,
  children,
  className,
  ...rest
}: ButtonProps) {
  const isOverlay = variant === "overlay";
  return (
    <button
      className={`inline-flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80 active:opacity-70 disabled:opacity-40 disabled:cursor-not-allowed ${
        isOverlay ? variantClasses(variant, darkTheme) : `${sizeClasses[size]} ${variantClasses(variant, darkTheme)}`
      } ${className ?? ""}`}
      {...rest}
    >
      {leftIcon && <span className="shrink-0 size-6 flex items-center justify-center">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="shrink-0 size-6 flex items-center justify-center">{rightIcon}</span>}
    </button>
  );
}
