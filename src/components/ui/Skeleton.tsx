export function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-grey-300 animate-pulse ${className ?? ""}`} />;
}
