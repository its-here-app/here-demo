import type { Spot } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";

const FILTERED_TYPES = new Set(["point_of_interest", "establishment"]);

interface SpotCardProps {
  spot: Pick<
    Spot,
    "google_place_id" | "name" | "address" | "photo_url" | "rating" | "types"
  >;
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

  const mapsUrl = `https://www.google.com/maps/place/?q=place_id:${spot.google_place_id}`;

  return (
    <div className={`flex items-start gap-2 ${className ?? ""}`}>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-2 flex-1 min-w-0 cursor-pointer group"
      >
        <div className="flex-shrink-0 w-20 h-20 rounded-xs overflow-hidden bg-black/5 transition-transform duration-400 ease-out group-hover:scale-100">
          {spot.photo_url && (
            <img
              src={spot.photo_url}
              alt={spot.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-header-radio-2 mb-[2px]">{spot.name}</p>
          <p className="text-body-xs text-secondary mb-1 line-clamp-1">
            {spot.address}
          </p>
          {(spot.rating != null || firstType) && (
            <div className="flex items-center gap-1 mt-1 flex-wrap">
              {firstType && <Badge>{firstType}</Badge>}
              {spot.rating != null && <Rating rating={spot.rating} />}
            </div>
          )}
        </div>
      </a>
      {(bookmark || action) && (
        <div className="flex-shrink-0 flex flex-col items-center gap-1">
          {bookmark}
          {action}
        </div>
      )}
    </div>
  );
}
