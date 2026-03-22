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
    <div className={className}>
      <ShelfTitle title={title} right={titleRight} />
      {children}
    </div>
  );
}
