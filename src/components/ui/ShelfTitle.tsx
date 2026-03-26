import type { ReactNode } from "react";

interface ShelfTitleProps {
  title: string;
  right?: ReactNode;
  className?: string;
}

export function ShelfTitle({ title, right, className }: ShelfTitleProps) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <p className="flex-1 min-w-0 truncate text-body-sm lg:text-header-golos-2 text-primary">{title}</p>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
