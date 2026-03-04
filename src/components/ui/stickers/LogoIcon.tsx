interface LogoIconProps {
  color?: "cream" | "neon";
  size?: number;
  className?: string;
}

export function LogoIcon({ color = "cream", size = 120, className }: LogoIconProps) {
  return (
    <img
      src={`/stickers/logo-icon-${color}.svg`}
      alt="here*"
      width={size}
      height={size}
      className={className}
    />
  );
}
