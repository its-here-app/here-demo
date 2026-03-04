import type { ReactNode } from "react";

interface BadgeProps {
  type?: "default" | "brand";
  children: ReactNode;
  className?: string;
}

export function Badge({ type = "default", children, className }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-start px-2 py-0.5 rounded-[6px] text-body-xs ${
        type === "brand" ? "bg-neon text-black" : "bg-black/5 text-black"
      } ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
