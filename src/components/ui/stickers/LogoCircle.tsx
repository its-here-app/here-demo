interface LogoCircleProps {
  color?: "cream" | "neon";
  size?: number;
  className?: string;
}

export function LogoCircle({ color = "cream", size = 150, className }: LogoCircleProps) {
  return (
    <img
      src={`/stickers/logo-circle-${color}.svg`}
      alt="here*"
      width={size}
      height={size}
      className={className}
    />
  );
}
