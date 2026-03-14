"use client";

import { Chevron } from "@/components/ui/icons/Chevron";

interface AppBarDropdownProps {
  label: string;
  isOpen: boolean;
  onClick?: () => void;
}

export function AppBarDropdown({ label, isOpen, onClick }: AppBarDropdownProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 cursor-pointer"
    >
      <span className="text-display-radio-2 text-primary">{label}</span>
      <Chevron direction={isOpen ? "up" : "down"} className="size-6 text-primary" />
    </button>
  );
}
