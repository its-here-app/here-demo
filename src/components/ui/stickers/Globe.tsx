interface GlobeProps {
  color?: "neon" | "black" | "cream" | "blue";
  className?: string;
}

export function Globe({ color = "neon", className }: GlobeProps) {
  return (
    <img
      src={`/stickers/globe-${color}.svg`}
      alt=""
      aria-hidden="true"
      width={210}
      height={110}
      className={className}
    />
  );
}
