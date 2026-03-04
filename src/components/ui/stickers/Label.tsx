interface LabelProps {
  text: string;
  /** "arrow" = → TEXT →; "star" = * TEXT * */
  variant?: "arrow" | "star";
  className?: string;
}

export function Label({ text, variant = "arrow", className }: LabelProps) {
  const prefix = variant === "arrow" ? "→" : "*";
  const suffix = variant === "arrow" ? "→" : "*";
  const display = `${prefix} ${text} ${suffix}`;
  const charCount = display.length;
  const width = Math.max(160, charCount * 14 + 32);

  return (
    <svg
      width={width}
      height={60}
      viewBox={`0 0 ${width} 60`}
      fill="none"
      aria-label={text}
      className={className}
    >
      <rect width={width} height={60} rx={16} fill="#fffbf7"/>
      <text
        x={width / 2}
        y={38}
        textAnchor="middle"
        fontFamily="'Golos Text', Golos, sans-serif"
        fontSize="22"
        fill="black"
        textTransform="uppercase"
      >
        {display.toUpperCase()}
      </text>
    </svg>
  );
}
