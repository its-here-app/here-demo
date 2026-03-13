interface Props {
  className?: string;
}

export function Spots({ className }: Props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M17.3408 12.0039C17.794 12.0454 18.1672 12.3911 18.2373 12.8486L19.1533 18.8486C19.24 19.4161 18.8339 19.9318 18.2783 19.9941L18.165 20H5.83594C5.26194 19.9999 4.81456 19.5206 4.83691 18.9619L4.84766 18.8486L5.76367 12.8486C5.8384 12.3606 6.25821 12.0001 6.75195 12H9.5V13H6.75195L5.83594 19H18.165L17.249 13H14.5V12H17.249L17.3408 12.0039Z" fill="currentColor"/>
      <circle cx="12" cy="8.5" r="1.5" fill="currentColor"/>
      <path d="M8.50879 11.375C6.42124 8.51808 8.46161 4.5 12 4.5C15.5384 4.5 17.5788 8.51809 15.4912 11.375L12 16.1533L8.50879 11.375Z" stroke="currentColor"/>
    </svg>
  );
}
