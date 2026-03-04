type NumberColor = "cream" | "neon" | "black" | "blue" | "outline";

interface NumberStickerProps {
  value: number | string;
  color?: NumberColor;
  size?: number;
  className?: string;
}

const backgrounds: Record<NumberColor, string> = {
  cream:   "#fffbf7",
  neon:    "#daff70",
  black:   "#000000",
  blue:    "#6395df",
  outline: "transparent",
};

const textColors: Record<NumberColor, string> = {
  cream:   "#000000",
  neon:    "#000000",
  black:   "#fffbf7",
  blue:    "#000000",
  outline: "#daff70",
};

export function NumberSticker({ value, color = "cream", size = 80, className }: NumberStickerProps) {
  const bg = backgrounds[color];
  const fg = textColors[color];
  const r = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle
        cx="40"
        cy="40"
        r="38"
        fill={bg}
        stroke={color === "outline" ? "#000000" : "none"}
        strokeWidth={color === "outline" ? 2 : 0}
      />
      <text
        x="40"
        y="52"
        textAnchor="middle"
        fontFamily="'PP Radio Grotesk', sans-serif"
        fontSize="42"
        fill={fg}
      >
        {value}
      </text>
    </svg>
  );
}
