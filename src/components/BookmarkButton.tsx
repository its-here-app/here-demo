"use client";

import { useSaves } from "@/lib/savesContext";
import type { DraftSpot } from "@/types";

interface BookmarkButtonProps {
  spot: DraftSpot;
}

export default function BookmarkButton({ spot }: BookmarkButtonProps) {
  const { isSaved, toggle } = useSaves();
  const saved = isSaved(spot.google_place_id);

  return (
    <button
      onClick={() => toggle(spot)}
      aria-label={saved ? "Remove from saves" : "Save spot"}
      className="flex-shrink-0 text-gray-400 hover:text-blue-500 transition-colors"
    >
      {saved ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 text-blue-500"
        >
          <path d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
          />
        </svg>
      )}
    </button>
  );
}
