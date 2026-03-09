interface Props {
  className?: string;
}

export function Block({ className }: Props) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="9.99967"
        cy="10.0007"
        r="6.25"
        stroke="currentColor"
        strokeWidth="0.833333"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.68426 14.9094L12.5693 4.71615L13.291 5.13281L7.40595 15.326L6.68426 14.9094Z"
        fill="currentColor"
      />
    </svg>
  );
}
