interface Props {
  className?: string;
}

export function Edit({ className }: Props) {
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
        d="M15.3088 5.93378C15.6341 6.25914 15.634 6.78638 15.3088 7.11183L7.13286 15.2878L4.70218 15.3623L4.77607 12.931L12.952 4.75504C13.2774 4.42993 13.8047 4.42996 14.13 4.75504L15.3088 5.93378ZM11.9397 6.94541L5.59918 13.2859L5.5619 14.5012L6.77793 14.4646L13.1184 8.12416L11.9397 6.94541ZM12.5287 6.35639L13.7074 7.53513L14.7198 6.52281L13.541 5.34407L12.5287 6.35639Z"
        fill="currentColor"
      />
    </svg>
  );
}
