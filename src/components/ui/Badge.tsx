import type { ReactNode } from "react";

interface BadgeProps {
  type?: "default" | "brand";
  children: ReactNode;
  className?: string;
}

export function Badge({ type = "default", children, className }: BadgeProps) {
  return (
    <span
      className={`capitalize inline-flex items-start px-2 py-0.5 rounded-[0.375rem] text-body-xs ${
        type === "brand" ? "bg-brand text-black" : "bg-black/5 text-primary"
      } ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
