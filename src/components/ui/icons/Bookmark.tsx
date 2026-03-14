interface Props {
  active?: boolean;
  className?: string;
}

export function Bookmark({ active, className }: Props) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M10.667 7.33301H21.333C22.4376 7.33301 23.333 8.22844 23.333 9.33301V25.999L16.7998 21.0996C16.3257 20.7441 15.6743 20.7441 15.2002 21.0996L8.66699 25.999V9.33301C8.66699 8.22844 9.56242 7.33301 10.667 7.33301Z"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeMiterlimit="3.86874"
        fill={active ? "currentColor" : "none"}
      />
    </svg>
  );
}
