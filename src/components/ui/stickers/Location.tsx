interface LocationProps {
  label: string;
  className?: string;
}

export function Location({ label, className }: LocationProps) {
  const width = Math.max(160, label.length * 15 + 64);
  return (
    <svg
      width={width}
      height={60}
      viewBox={`0 0 ${width} 60`}
      fill="none"
      aria-label={label}
      className={className}
    >
      <rect width={width} height={60} rx={16} fill="#daff70"/>
      {/* Map pin icon */}
      <path
        d="M 28 30 C 28 24.477 23.523 20 18 20 C 12.477 20 8 24.477 8 30 C 8 37 18 46 18 46 C 18 46 28 37 28 30 Z M 22 30 C 22 32.209 20.209 34 18 34 C 15.791 34 14 32.209 14 30 C 14 27.791 15.791 26 18 26 C 20.209 26 22 27.791 22 30 Z"
        fill="black"
      />
      <text
        x="38"
        y="38"
        fontFamily="'Golos Text', Golos, sans-serif"
        fontSize="22"
        fill="black"
        textTransform="uppercase"
      >
        {label.toUpperCase()}
      </text>
    </svg>
  );
}
