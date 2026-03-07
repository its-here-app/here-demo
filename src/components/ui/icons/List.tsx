interface Props {
  focus?: boolean;
  className?: string;
}

export function List({ focus = false, className }: Props) {
  if (focus) {
    return (
      <svg viewBox="0 0 24 24" width={24} height={24} fill="none">
        <path d="M10 7.25H20V8.75H10V7.25Z" fill="currentColor" />
        <path d="M4 7.25H7V8.75H4V7.25Z" fill="currentColor" />
        <path d="M10 11.25H20V12.75H10V11.25Z" fill="currentColor" />
        <path d="M4 11.25H7V12.75H4V11.25Z" fill="currentColor" />
        <path d="M10 15.25H20V16.75H10V15.25Z" fill="currentColor" />
        <path d="M4 15.25H7V16.75H4V15.25Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width={24} height={24} fill="none">
      <path d="M10 7.5H20V8.5H10z" fill="currentColor" />
      <line x1="4" y1="8" x2="7" y2="8" stroke="currentColor" />
      <path d="M10 11.5H20V12.5H10z" fill="currentColor" />
      <path d="M4 11.5H7V12.5H4z" fill="currentColor" />
      <path d="M10 15.5H20V16.5H10z" fill="currentColor" />
      <path d="M4 15.5H7V16.5H4z" fill="currentColor" />
    </svg>
  );
}
