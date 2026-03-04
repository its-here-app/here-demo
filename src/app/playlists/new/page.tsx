"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { getUserUsername } from "@/lib/services/users";
import {
  searchSpots,
  upsertSpot,
  addSpotToPlaylist,
  createPlaylist,
} from "@/lib/services/playlists";
import type { DraftSpot } from "@/types";

export default function NewPlaylistPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<"info" | "review">("info");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [spotsList, setSpotsList] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [foundSpots, setFoundSpots] = useState<DraftSpot[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!user) return;
    getUserUsername(user.id).then((name) => {
      if (name) setUsername(name);
    });
  }, [user]);

  if (!authLoading && !user) {
    router.push("/login");
    return null;
  }

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const spots = spotsList
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      if (spots.length === 0) {
        setError("Please add at least one spot");
        setLoading(false);
        return;
      }

      const foundSpotsTemp: DraftSpot[] = [];

      for (const spot of spots) {
        try {
          const results = await searchSpots(spot, city);
          if (results.length > 0) {
            const place = results[0];
            foundSpotsTemp.push({
              google_place_id: place.spot_id,
              name: place.name,
              address: place.address,
              photo_url: place.photo_url,
              rating: place.rating,
              types: place.types,
            });
          }
        } catch (err) {
          console.error(`Error finding spot: ${spot}`, err);
        }
      }

      setFoundSpots(foundSpotsTemp);
      setStep("review");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreatePlaylist() {
    if (!user) return;

    setSaving(true);
    setError("");

    try {
      const slug =
        city
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") +
        "-" +
        Math.random().toString(36).slice(2, 7);

      const playlist = await createPlaylist({
        user_id: user.id,
        name: city,
        city,
        slug,
        description,
        is_public: isPublic,
      });

      for (let i = 0; i < foundSpots.length; i++) {
        const spot = foundSpots[i];
        const upsertedSpot = await upsertSpot({
          google_place_id: spot.google_place_id,
          name: spot.name,
          address: spot.address,
          photo_url: spot.photo_url,
          rating: spot.rating,
          types: spot.types,
        });
        await addSpotToPlaylist(playlist.id, upsertedSpot.id, i);
      }

      router.push(`/playlists/${playlist.slug}`);
    } catch (err: any) {
      console.error("Error creating playlist:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (step === "info") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2">Create a Playlist</h1>
          <p className="text-gray-600 mb-8">
            Share your favorite spots in a city
          </p>

          <form onSubmit={handleContinue} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Which city?
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., San Francisco"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="What makes this playlist special?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Add spots (one per line)
              </label>
              <textarea
                value={spotsList}
                onChange={(e) => setSpotsList(e.target.value)}
                rows={8}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                placeholder={`Blue Bottle Coffee\nTartine Bakery\nGolden Gate Park`}
              />
              <p className="text-xs text-gray-500 mt-1">
                We&apos;ll try to find these places in{" "}
                {city || "the city you specify"}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
            >
              {loading ? "Finding spots..." : "Continue"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // Step 2: Review
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Review Your Playlist</h1>
        <p className="text-gray-600 mb-8">
          Make sure everything looks good before sharing
        </p>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="mb-4">
            <p className="text-sm text-gray-500">City</p>
            <p className="text-xl font-semibold">{city}</p>
          </div>

          {description && (
            <div className="mb-4">
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-gray-700">{description}</p>
            </div>
          )}

          <div className="mb-4">
            <p className="text-sm text-gray-500">Spots found</p>
            <p className="text-lg font-medium">{foundSpots.length} spots</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Created by</p>
            <p className="text-gray-700">
              {username ? `@${username}` : user?.email}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Spots in this playlist</h2>
          <div className="space-y-2">
            {foundSpots.map((spot) => (
              <div
                key={spot.google_place_id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4"
              >
                <p className="font-medium">{spot.name}</p>
                <p className="text-sm text-gray-600">{spot.address}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium">Make this playlist public</p>
              <p className="text-sm text-gray-500">
                Anyone can view public playlists
              </p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm mb-6">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => setStep("info")}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={handleCreatePlaylist}
            disabled={saving}
            className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
          >
            {saving ? "Creating..." : "Share Playlist"}
          </button>
        </div>
      </div>
    </main>
  );
}
