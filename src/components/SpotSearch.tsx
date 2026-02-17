"use client";

import { useState } from "react";

interface Spot {
  spot_id: string;
  name: string;
  address: string;
  rating?: number;
  types?: string[];
}

export default function SpotSearch() {
  const [query, setQuery] = useState("");
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/spots/search?query=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Failed to search spots");
      }

      const data = await response.json();
      setSpots(data.places);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSpots([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for places... (e.g., 'coffee shops in SF')"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {spots.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Results ({spots.length})</h2>
          {spots.map((spot) => (
            <div
              key={spot.spot_id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold">{spot.name}</h3>
              <p className="text-gray-600">{spot.address}</p>
              {spot.rating && (
                <p className="text-sm text-yellow-600 mt-1">
                  ⭐ {spot.rating} / 5
                </p>
              )}
              {spot.types && (
                <p className="text-xs text-gray-400 mt-1">
                  {spot.types.slice(0, 3).join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && spots.length === 0 && query && (
        <p className="text-gray-500 text-center">
          No results found. Try a different search.
        </p>
      )}
    </div>
  );
}
