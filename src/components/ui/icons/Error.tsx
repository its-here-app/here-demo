interface Props {
  focus?: boolean;
  className?: string;
}

export function Error({ focus, className }: Props) {
  if (focus) {
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
        <path
          d="M12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4ZM11.5 14.5V15.5H12.5V14.5H11.5ZM11.5 8.5V13.5H12.5V8.5H11.5Z"
          fill="currentColor"
        />
      </svg>
    );
  }

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
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" />
      <path d="M11.5 8.5H12.5V13.5H11.5V8.5Z" fill="currentColor" />
      <path d="M11.5 14.5H12.5V15.5H11.5V14.5Z" fill="currentColor" />
    </svg>
  );
}
