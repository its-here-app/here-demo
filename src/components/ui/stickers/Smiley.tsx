interface SmileyProps {
  /** "neon" = yellow fill; "outline" = neon stroke on transparent (for dark backgrounds) */
  color?: "neon" | "outline";
  size?: number;
  className?: string;
}

export function Smiley({ color = "neon", size = 127, className }: SmileyProps) {
  return (
    <img
      src={`/stickers/smiley-${color}.svg`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={className}
    />
  );
}
