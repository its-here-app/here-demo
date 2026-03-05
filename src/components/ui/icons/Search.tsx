interface Props {
  active?: boolean;
  className?: string;
}

export function Search({ active, className }: Props) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle
        cx="9.5"
        cy="9.5"
        r="6"
        stroke="black"
        strokeWidth={active ? 2 : 1.5}
        fill="none"
      />
      <path
        d="M14 14L19 19"
        stroke="black"
        strokeWidth={active ? 2 : 1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}
