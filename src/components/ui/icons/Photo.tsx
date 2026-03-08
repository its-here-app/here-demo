export function Photo({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <rect x="5.5" y="5.5" width="13" height="13" rx="1.5" stroke="currentColor" />
      <path
        d="M16.25 16.2H7.75L9.75 13.2L11.25 15.2L13.75 11.2L16.25 16.2Z"
        fill="currentColor"
        stroke="currentColor"
      />
      <circle cx="9.75" cy="9.35693" r="1.5" fill="currentColor" />
    </svg>
  );
}
