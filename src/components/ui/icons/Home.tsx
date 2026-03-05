interface Props {
  active?: boolean;
  className?: string;
}

export function Home({ active, className }: Props) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {active ? (
        <path d="M2 9.5L11 2L20 9.5V20H14V13H8V20H2V9.5Z" fill="black" />
      ) : (
        <path
          d="M2 9.5L11 2L20 9.5V20H14V13H8V20H2V9.5Z"
          stroke="black"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
