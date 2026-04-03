import { Skeleton } from "@/components/ui/Skeleton";

export function SpotSkeleton() {
  return (
    <div className="flex items-start gap-2">
      <Skeleton className="shrink-0 w-20 h-20 rounded-xs" />
      <div className="flex-1 flex flex-col gap-1.5 pt-1">
        <Skeleton className="h-3.5 w-2/5 rounded-full" />
        <Skeleton className="h-3 w-3/5 rounded-full" />
      </div>
    </div>
  );
}

export function SpotSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }, (_, i) => (
        <SpotSkeleton key={i} />
      ))}
    </div>
  );
}
