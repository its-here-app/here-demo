interface Props {
  focus?: boolean;
  className?: string;
}

export function Info({ focus = false, className }: Props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
      {focus ? (
        <path d="M12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4ZM11.5 10.5V15.5H12.5V10.5H11.5ZM11.5 8.5V9.5H12.5V8.5H11.5Z" fill="currentColor" />
      ) : (
        <>
          <circle cx="12" cy="12" r="7.5" stroke="currentColor" />
          <path d="M12.5 15.5001L11.5 15.5001L11.5 10.5001L12.5 10.5001L12.5 15.5001Z" fill="currentColor" />
          <path d="M12.5 9.50012L11.5 9.50012L11.5 8.50012L12.5 8.50012L12.5 9.50012Z" fill="currentColor" />
        </>
      )}
    </svg>
  );
}
