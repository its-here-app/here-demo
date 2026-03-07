"use client";

interface ScrimProps {
  /** Controls opacity — true = opacity-100, false = opacity-0 */
  visible: boolean;
  onClick?: () => void;
  /** "default" = bg-black/40, "dark" = bg-black (for full-page overlays) */
  variant?: "default" | "dark";
}

export function Scrim({ visible, onClick, variant = "default" }: ScrimProps) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-300 ${
        variant === "dark" ? "bg-black" : "bg-black/40"
      } ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={onClick}
    />
  );
}
