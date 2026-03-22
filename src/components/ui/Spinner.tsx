interface SpinnerProps {
  className?: string;
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <div className={`rounded-full border-2 border-subtle border-t-white animate-spin ${className ?? "size-5"}`} />
  );
}
