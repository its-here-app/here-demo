interface Props {
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

const rotations: Record<NonNullable<Props["direction"]>, string> = {
  down: "rotate-0",
  up: "rotate-180",
  left: "rotate-90",
  right: "-rotate-90",
};

export function Chevron({ direction = "down", className }: Props) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={`${rotations[direction]} ${className ?? ""}`}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.08813 9.3461L11.9956 14.9988L12.7181 14.3074L6.81065 8.65475L6.08813 9.3461Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.9127 9.34195L11.9997 15L11.2772 14.3086L17.1902 8.65059L17.9127 9.34195Z"
        fill="currentColor"
      />
    </svg>
  );
}
