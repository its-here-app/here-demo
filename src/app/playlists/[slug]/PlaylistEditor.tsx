"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  searchSpots,
  upsertSpot,
  addSpotToPlaylist,
  removeSpotFromPlaylist,
  reorderPlaylistSpots,
  deletePlaylist,
} from "@/lib/services/playlists";
import type { PlaylistSpot, SearchResult } from "@/types";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  playlist: any;
  isOwner: boolean;
}

function GripIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="5" cy="4" r="1.5" />
      <circle cx="11" cy="4" r="1.5" />
      <circle cx="5" cy="8" r="1.5" />
      <circle cx="11" cy="8" r="1.5" />
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="11" cy="12" r="1.5" />
    </svg>
  );
}

function SortableSpotCard({
  ps,
  editMode,
  removingId,
  onRemove,
}: {
  ps: PlaylistSpot;
  editMode: boolean;
  removingId: string | null;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ps.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-lg p-5 flex items-center gap-3"
    >
      {editMode && (
        <button
          {...attributes}
          {...listeners}
          className="flex-shrink-0 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripIcon />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold truncate">{ps.spots.name}</h3>
        <p className="text-sm text-gray-500 truncate">{ps.spots.address}</p>
        {ps.notes && (
          <p className="text-sm text-gray-700 italic mt-1">{ps.notes}</p>
        )}
      </div>
      {editMode && (
        <button
          onClick={() => onRemove(ps.id)}
          disabled={removingId === ps.id}
          className="flex-shrink-0 text-sm text-red-500 hover:text-red-700 disabled:opacity-40"
        >
          {removingId === ps.id ? "Removing…" : "Remove"}
        </button>
      )}
    </div>
  );
}

export default function PlaylistEditor({ playlist, isOwner }: Props) {
  const router = useRouter();

  const [editMode, setEditMode] = useState(false);
  const [spots, setSpots] = useState<PlaylistSpot[]>(
    [...playlist.playlist_spots].sort(
      (a: PlaylistSpot, b: PlaylistSpot) =>
        (a.position ?? 0) - (b.position ?? 0)
    )
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const existingPlaceIds = new Set(spots.map((s) => s.spots.google_place_id));

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = spots.findIndex((s) => s.id === active.id);
    const newIndex = spots.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(spots, oldIndex, newIndex);
    setSpots(reordered);

    await reorderPlaylistSpots(
      reordered.map((s, i) => ({ id: s.id, position: i }))
    );
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setError("");
    try {
      const results = await searchSpots(searchQuery, playlist.city);
      setSearchResults(results.filter((p) => !existingPlaceIds.has(p.spot_id)));
    } catch {
      setError("Failed to search for spots.");
    } finally {
      setSearching(false);
    }
  }

  async function handleAddSpot(place: SearchResult) {
    setAddingId(place.spot_id);
    setError("");
    try {
      const spot = await upsertSpot({
        google_place_id: place.spot_id,
        name: place.name,
        address: place.address,
      });
      const ps = await addSpotToPlaylist(playlist.id, spot.id, spots.length);
      setSpots([...spots, { ...ps, spots: spot }]);
      setSearchResults(searchResults.filter((r) => r.spot_id !== place.spot_id));
    } catch {
      setError("Failed to add spot.");
    } finally {
      setAddingId(null);
    }
  }

  async function handleRemoveSpot(playlistSpotId: string) {
    setRemovingId(playlistSpotId);
    setError("");
    try {
      await removeSpotFromPlaylist(playlistSpotId);
      setSpots(spots.filter((s) => s.id !== playlistSpotId));
    } catch {
      setError("Failed to remove spot.");
    } finally {
      setRemovingId(null);
    }
  }

  async function handleDeletePlaylist() {
    setDeleting(true);
    setError("");
    try {
      await deletePlaylist(playlist.id);
      router.push(`/${playlist.profiles.username}`);
    } catch {
      setError("Failed to delete playlist.");
      setDeleting(false);
    }
  }

  function handleExitEdit() {
    setEditMode(false);
    setSearchQuery("");
    setSearchResults([]);
    setConfirmDelete(false);
    setError("");
  }

  return (
    <div className="w-full max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
            {playlist.description && (
              <p className="text-gray-600 mb-4">{playlist.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <p>
                By{" "}
                <Link
                  href={`/${playlist.profiles.username}`}
                  className="text-blue-500 hover:underline"
                >
                  @{playlist.profiles.username}
                </Link>
              </p>
              <p>•</p>
              <p>{spots.length} spots</p>
              <p>•</p>
              <p>{playlist.is_public ? "Public" : "Private"}</p>
            </div>
          </div>

          {isOwner && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {editMode ? (
                <>
                  {confirmDelete ? (
                    <>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeletePlaylist}
                        disabled={deleting}
                        className="px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                      >
                        {deleting ? "Deleting…" : "Confirm delete"}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="px-3 py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50"
                      >
                        Delete
                      </button>
                      <button
                        onClick={handleExitEdit}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Done
                      </button>
                    </>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Edit
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm mb-4">
          {error}
        </div>
      )}

      {/* Spots */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={spots.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3 mb-6">
            {spots.length === 0 && (
              <p className="text-gray-500 text-sm">No spots yet.</p>
            )}
            {spots.map((ps) => (
              <SortableSpotCard
                key={ps.id}
                ps={ps}
                editMode={editMode}
                removingId={removingId}
                onRemove={handleRemoveSpot}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Search — edit mode only */}
      {editMode && (
        <div>
          <form onSubmit={handleSearch} className="flex gap-2 mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search spots in ${playlist.city}`}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={searching}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {searching ? "Searching…" : "Search"}
            </button>
          </form>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              {searchResults.map((place) => (
                <div
                  key={place.spot_id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-medium text-sm">{place.name}</p>
                    <p className="text-xs text-gray-500">{place.address}</p>
                  </div>
                  <button
                    onClick={() => handleAddSpot(place)}
                    disabled={addingId === place.spot_id}
                    className="flex-shrink-0 text-sm text-blue-500 hover:text-blue-700 disabled:opacity-40"
                  >
                    {addingId === place.spot_id ? "Adding…" : "Add"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
