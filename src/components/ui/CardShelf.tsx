import type { ReactNode } from "react";
import { ShelfTitle } from "./ShelfTitle";

interface CardShelfProps {
  title: string;
  titleRight?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function CardShelf({ title, titleRight, children, className }: CardShelfProps) {
  return (
    <div className={`flex flex-col gap-3 ${className ?? ""}`}>
      <ShelfTitle title={title} right={titleRight} />
      {children}
    </div>
  );
}
