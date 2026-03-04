interface StaffPickProps {
  color?: "neon" | "blue" | "outline";
  size?: number;
  className?: string;
}

export function StaffPick({ color = "neon", size = 160, className }: StaffPickProps) {
  return (
    <img
      src={`/stickers/staff-pick-${color}.svg`}
      alt="Staff Pick"
      width={size}
      height={size}
      className={className}
    />
  );
}
