import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "filled" | "tonal" | "outline" | "text" | "overlay";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  darkTheme?: boolean;
  /** Uses a muted disabled appearance (full opacity, white/15 bg, grey text) instead of opacity-40 */
  softDisabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 py-2 gap-1 rounded-[0.5rem] text-body-xs",
  md: "h-9 px-[0.875rem] py-[0.625rem] gap-1 rounded-[0.5rem] text-body-xs",
  lg: "h-[3.125rem] px-5 py-[1.125rem] gap-1.5 rounded-[1rem] text-body-sm",
};

function variantClasses(variant: ButtonVariant, darkTheme: boolean, size: ButtonSize): string {
  if (variant === "overlay") {
    return "backdrop-blur-sm bg-white/20 text-white rounded-full px-3 py-1.5 text-body-xs gap-1";
  }
  if (!darkTheme && size !== "sm") {
    switch (variant) {
      case "filled":  return "bg-black text-white";
      case "tonal":   return "bg-black/[0.06] text-primary";
      case "outline": return "border border-subtle text-primary";
      case "text":    return "text-primary";
    }
  } else {
    switch (variant) {
      case "filled":  return "bg-white text-black";
      case "tonal":   return "bg-white/15 text-primary";
      case "outline": return "border border-subtle text-primary";
      case "text":    return "text-primary";
    }
  }
}

export function Button({
  variant = "filled",
  size = "md",
  darkTheme = false,
  softDisabled = false,
  leftIcon,
  rightIcon,
  children,
  className,
  ...rest
}: ButtonProps) {
  const isOverlay = variant === "overlay";
  const disabledClasses = softDisabled
    ? "disabled:!opacity-100 disabled:!bg-white/15 disabled:text-secondary disabled:!cursor-not-allowed"
    : "disabled:opacity-40 disabled:!cursor-not-allowed";
  return (
    <button
      className={`inline-flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80 active:opacity-70 ${disabledClasses} ${
        isOverlay ? variantClasses(variant, darkTheme, size) : `${sizeClasses[size]} ${variantClasses(variant, darkTheme, size)}`
      } ${className ?? ""}`}
      {...rest}
    >
      {leftIcon && <span className="shrink-0 size-6 flex items-center justify-center">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="shrink-0 size-6 flex items-center justify-center">{rightIcon}</span>}
    </button>
  );
}
