interface Props {
  active?: boolean;
  className?: string;
}

export function Lock({ active, className }: Props) {
  if (active) {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect x="6.5" y="9.5" width="11" height="10" rx="1.5" fill="currentColor" stroke="currentColor" />
        <path
          d="M12 4C14.2091 4 16 5.79086 16 8V9H14.5V8C14.5 6.61929 13.3807 5.5 12 5.5C10.6193 5.5 9.5 6.61929 9.5 8V9H8V8C8 5.79086 9.79086 4 12 4Z"
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
      className={className}
    >
      <path
        d="M12 4C14.2091 4 16 5.79086 16 8V9H15V8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8V9H8V8C8 5.79086 9.79086 4 12 4Z"
        fill="currentColor"
      />
      <rect x="6.5" y="9.5" width="11" height="10" rx="1.5" stroke="currentColor" />
    </svg>
  );
}
