interface ArrowProps {
  color?: "cream" | "black" | "neon" | "blue";
  size?: number;
  className?: string;
}

export function Arrow({ color = "cream", size = 120, className }: ArrowProps) {
  return (
    <img
      src={`/stickers/arrow-${color}.svg`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={className}
    />
  );
}
