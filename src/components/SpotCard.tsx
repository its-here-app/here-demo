import type { Spot } from "@/types";

const FILTERED_TYPES = new Set(["point_of_interest", "establishment"]);

interface SpotCardProps {
  spot: Pick<Spot, "name" | "address" | "photo_url" | "rating" | "types">;
  action?: React.ReactNode;
  bookmark?: React.ReactNode;
  className?: string;
}

export default function SpotCard({ spot, action, bookmark, className }: SpotCardProps) {
  const displayTypes = spot.types
    ?.filter((t) => !FILTERED_TYPES.has(t))
    .slice(0, 2)
    .map((t) => t.replace(/_/g, " "))
    .join(" · ");

  return (
    <div className={`flex items-start gap-3 ${className ?? ""}`}>
      {spot.photo_url && (
        <img
          src={spot.photo_url}
          alt={spot.name}
          className="flex-shrink-0 w-16 h-16 rounded-lg object-cover"
        />
      )}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold truncate">{spot.name}</h3>
        <p className="text-sm text-gray-500 truncate">{spot.address}</p>
        {(spot.rating != null || displayTypes) && (
          <div className="flex items-center gap-3 mt-1">
            {spot.rating != null && (
              <span className="text-xs text-yellow-600">★ {spot.rating}</span>
            )}
            {displayTypes && (
              <span className="text-xs text-gray-400 truncate">
                {displayTypes}
              </span>
            )}
          </div>
        )}
      </div>
      {(bookmark || action) && (
        <div className="flex-shrink-0 flex items-center gap-2">
          {bookmark}
          {action}
        </div>
      )}
    </div>
  );
}
