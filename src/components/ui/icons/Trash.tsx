interface Props {
  className?: string;
}

export function Trash({ className }: Props) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M17.4785 8.5L17.0801 18.0625C17.0466 18.8658 16.386 19.4998 15.582 19.5H8.41797C7.61405 19.4998 6.95342 18.8658 6.91992 18.0625L6.52148 8.5H17.4785Z"
        stroke="currentColor"
      />
      <path
        d="M6.5 6.5H17.5C17.7761 6.5 18 6.72386 18 7V8C18 8.27614 17.7761 8.5 17.5 8.5H6.5C6.22386 8.5 6 8.27614 6 8V7C6 6.72386 6.22386 6.5 6.5 6.5Z"
        stroke="currentColor"
      />
      <path
        d="M10.5 5.5H13.5C13.7761 5.5 14 5.72386 14 6C14 6.27614 13.7761 6.5 13.5 6.5H10.5C10.2239 6.5 10 6.27614 10 6C10 5.72386 10.2239 5.5 10.5 5.5Z"
        stroke="currentColor"
      />
      <line x1="10.3942" y1="10.9845" x2="10.6036" y2="16.9808" stroke="currentColor" />
      <line x1="13.6052" y1="11.0194" x2="13.3958" y2="17.0157" stroke="currentColor" />
    </svg>
  );
}
