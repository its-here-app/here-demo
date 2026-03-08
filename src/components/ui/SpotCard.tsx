import type { Spot } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";

const FILTERED_TYPES = new Set(["point_of_interest", "establishment"]);

interface SpotCardProps {
  spot: Pick<Spot, "name" | "address" | "photo_url" | "rating" | "types">;
  action?: React.ReactNode;
  bookmark?: React.ReactNode;
  className?: string;
}

export default function SpotCard({
  spot,
  action,
  bookmark,
  className,
}: SpotCardProps) {
  const firstType = spot.types
    ?.filter((t) => !FILTERED_TYPES.has(t))
    .map((t) => t.replace(/_/g, " "))[0];

  return (
    <div className={`flex items-start gap-2 ${className ?? ""}`}>
      {spot.photo_url && (
        <img
          src={spot.photo_url}
          alt={spot.name}
          className="flex-shrink-0 w-20 h-20 rounded-xs object-cover"
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-header-radio-2 mb-[2px]">{spot.name}</p>
        <p className="text-body-xs text-secondary mb-1 line-clamp-1 ">
          {spot.address}
        </p>
        {(spot.rating != null || firstType) && (
          <div className="flex items-center gap-1 mt-1 flex-wrap">
            {firstType && <Badge>{firstType}</Badge>}
            {spot.rating != null && <Rating rating={spot.rating} />}
          </div>
        )}
      </div>
      {(bookmark || action) && (
        <div className="flex-shrink-0 flex flex-col items-center gap-1">
          {bookmark}
          {action}
        </div>
      )}
    </div>
  );
}
