interface HereCircleProps {
  size?: number;
  className?: string;
}

export function HereCircle({ size = 202, className }: HereCircleProps) {
  return (
    <img
      src="/stickers/here-circle.svg"
      alt="here*"
      width={size}
      height={size}
      className={className}
    />
  );
}
