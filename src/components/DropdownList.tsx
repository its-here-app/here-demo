import { type ReactNode } from "react";

interface DropdownListProps {
  children: ReactNode;
}

export function DropdownList({ children }: DropdownListProps) {
  return <div className="flex flex-col gap-[1rem]">{children}</div>;
}
