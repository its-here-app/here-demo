type CityDateColor = "cream" | "neon" | "black" | "blue";
type CityDateStyle = "arrow" | "at";

interface CityDateProps {
  city: string;
  year: string | number;
  color?: CityDateColor;
  /** "arrow" = CITY → YEAR; "at" = CITY @ YEAR */
  style?: CityDateStyle;
  className?: string;
}

const backgrounds: Record<CityDateColor, string> = {
  cream: "#fffbf7",
  neon:  "#daff70",
  black: "#000000",
  blue:  "#6395df",
};

const textColors: Record<CityDateColor, string> = {
  cream: "#000000",
  neon:  "#000000",
  black: "#fffbf7",
  blue:  "#000000",
};

export function CityDate({ city, year, color = "blue", style = "arrow", className }: CityDateProps) {
  const bg = backgrounds[color];
  const fg = textColors[color];
  const sep = style === "arrow" ? "→" : "@";
  const text = `${city.toUpperCase()} ${sep} ${year}`;
  const width = 212;

  return (
    <svg
      width={width}
      height={80}
      viewBox={`0 0 ${width} 80`}
      fill="none"
      aria-label={`${city} ${year}`}
      className={className}
    >
      <rect width={width} height={80} rx={14} fill={bg}/>
      <text
        x={width / 2}
        y={48}
        textAnchor="middle"
        fontFamily="'Golos Text', Golos, sans-serif"
        fontSize="24"
        fill={fg}
      >
        {text}
      </text>
    </svg>
  );
}
