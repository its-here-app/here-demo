interface Props {
  focus?: boolean;
  className?: string;
}

export function Link({ focus, className }: Props) {
  if (focus) {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M10.8333 12.917L13.4294 12.917C14.9872 12.917 16.25 11.6541 16.25 10.0964C16.25 8.53856 14.9872 7.27572 13.4294 7.27572L10.8333 7.27572"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <path
          d="M9.16667 7.27539L6.57064 7.27539C5.01284 7.27539 3.75 8.53823 3.75 10.096C3.75 11.6538 5.01284 12.9167 6.57064 12.9167H9.16667"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.5 10.625H7.5V9.375H12.5V10.625Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.667 9.9043C16.667 11.6922 15.2176 13.1416 13.4297 13.1416L10.8337 13.1416L10.8337 12.3083L13.4297 12.3083C14.7574 12.3083 15.8337 11.232 15.8337 9.9043C15.8337 8.57662 14.7574 7.50033 13.4297 7.50033L10.8337 7.50033L10.8337 6.66699L13.4297 6.66699C15.2176 6.66699 16.667 8.11638 16.667 9.9043Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.33301 9.9043C3.33301 8.11638 4.7824 6.66699 6.57031 6.66699L9.16634 6.66699V7.50033L6.57031 7.50033C5.24264 7.50033 4.16634 8.57662 4.16634 9.9043C4.16634 11.232 5.24264 12.3083 6.57031 12.3083H9.16634V13.1416H6.57031C4.7824 13.1416 3.33301 11.6922 3.33301 9.9043Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5 10.2249H7.5V9.3916H12.5V10.2249Z"
        fill="currentColor"
      />
    </svg>
  );
}
