"use client";

import type { InputHTMLAttributes } from "react";

interface GhostInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function GhostInput({ className, ...props }: GhostInputProps) {
  return (
    <div className={`flex flex-col gap-3 w-full ${className ?? ""}`}>
      <input
        className="text-display-crimson-1 text-neon text-center bg-transparent border-none outline-none w-full placeholder:text-white/30"
        {...props}
      />
      <div className="h-px bg-white" />
    </div>
  );
}
