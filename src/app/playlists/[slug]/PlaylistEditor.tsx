"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import {
  upsertSpot,
  addSpotToPlaylist,
  removeSpotFromPlaylist,
  reorderPlaylistSpots,
  updatePlaylistDescription,
  updateSpotNotes,
  uploadPlaylistCover,
  deletePlaylist,
} from "@/lib/services/playlists";
import { getDefaultCover } from "@/lib/playlist-covers";
import type { PlaylistSpot, SearchResult } from "@/types";
import SpotCard from "@/components/SpotCard";
import BookmarkButton from "@/components/BookmarkButton";
import SpotSearchInput from "@/components/SpotSearchInput";
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
  onNotesChange,
  onNotesBlur,
}: {
  ps: PlaylistSpot;
  editMode: boolean;
  removingId: string | null;
  onRemove: (id: string) => void;
  onNotesChange: (id: string, notes: string) => void;
  onNotesBlur: (id: string, notes: string) => void;
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
      className="bg-white border border-gray-200 rounded-lg p-5"
    >
      <div className="flex items-start gap-3">
        {editMode && (
          <button
            {...attributes}
            {...listeners}
            className="flex-shrink-0 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing mt-0.5"
            aria-label="Drag to reorder"
          >
            <GripIcon />
          </button>
        )}
        <SpotCard
          spot={ps.spots}
          className="flex-1"
          bookmark={<BookmarkButton spot={ps.spots} />}
          action={
            editMode ? (
              <button
                onClick={() => onRemove(ps.id)}
                disabled={removingId === ps.id}
                className="text-sm text-red-500 hover:text-red-700 disabled:opacity-40"
              >
                {removingId === ps.id ? "Removing…" : "Remove"}
              </button>
            ) : undefined
          }
        />
      </div>

      {editMode ? (
        <textarea
          value={ps.notes ?? ""}
          onChange={(e) => onNotesChange(ps.id, e.target.value)}
          onBlur={(e) => onNotesBlur(ps.id, e.target.value)}
          placeholder="Add a note…"
          rows={2}
          className="mt-3 w-full text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      ) : (
        ps.notes && (
          <p className="text-sm text-gray-700 italic mt-2">{ps.notes}</p>
        )
      )}
    </div>
  );
}

export default function PlaylistEditor({ playlist, isOwner }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  const [editMode, setEditMode] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string>(
    playlist.cover_photo_url ?? getDefaultCover(playlist.city)
  );
  const [uploadingCover, setUploadingCover] = useState(false);
  const [description, setDescription] = useState<string>(playlist.description ?? "");
  const [spots, setSpots] = useState<PlaylistSpot[]>(
    [...playlist.playlist_spots].sort(
      (a: PlaylistSpot, b: PlaylistSpot) =>
        (a.position ?? 0) - (b.position ?? 0)
    )
  );
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

  async function handleAddSpot(place: SearchResult) {
    setAddingId(place.spot_id);
    setError("");
    try {
      const spot = await upsertSpot({
        google_place_id: place.spot_id,
        name: place.name,
        address: place.address,
        photo_url: place.photo_url,
        rating: place.rating,
        types: place.types,
      });
      const ps = await addSpotToPlaylist(playlist.id, spot.id, spots.length, user?.id ?? "");
      setSpots([...spots, { ...ps, spots: spot }]);
    } catch {
      setError("Failed to add spot.");
    } finally {
      setAddingId(null);
    }
  }

  async function handleDescriptionBlur(value: string) {
    try {
      await updatePlaylistDescription(playlist.id, value);
    } catch {
      setError("Failed to save description.");
    }
  }

  function handleNotesChange(spotId: string, notes: string) {
    setSpots(spots.map((s) => (s.id === spotId ? { ...s, notes } : s)));
  }

  async function handleNotesBlur(spotId: string, notes: string) {
    try {
      await updateSpotNotes(spotId, notes);
    } catch {
      setError("Failed to save notes.");
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
      await deletePlaylist(playlist.id, user?.id ?? "");
      router.push(`/${playlist.profiles.username}`);
    } catch {
      setError("Failed to delete playlist.");
      setDeleting(false);
    }
  }

  function handleExitEdit() {
    setEditMode(false);
    setConfirmDelete(false);
    setError("");
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const url = await uploadPlaylistCover(playlist.id, user?.id ?? "", file, coverUrl);
      setCoverUrl(url);
    } catch {
      setError("Failed to upload cover photo.");
    } finally {
      setUploadingCover(false);
    }
  }

  return (
    <div className="w-full max-w-2xl">
      {/* Cover photo */}
      <div className="relative w-full h-52 rounded-xl overflow-hidden mb-6 bg-gray-100">
        <img
          src={coverUrl}
          alt={playlist.name}
          className="w-full h-full object-cover"
        />
        {editMode && (
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer hover:bg-black/50 transition-colors">
            <span className="text-white text-sm font-medium">
              {uploadingCover ? "Uploading…" : "Change photo"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleCoverUpload}
              disabled={uploadingCover}
            />
          </label>
        )}
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
            {editMode ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={(e) => handleDescriptionBlur(e.target.value)}
                placeholder="Add a description…"
                rows={2}
                className="w-full text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              />
            ) : (
              description && (
                <p className="text-gray-600 mb-4">{description}</p>
              )
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
                onNotesChange={handleNotesChange}
                onNotesBlur={handleNotesBlur}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Search — edit mode only */}
      {editMode && (
        <SpotSearchInput
          placeholder={`Search spots in ${playlist.city}`}
          city={playlist.city}
          excludePlaceIds={existingPlaceIds}
          renderAction={(place) => (
            <button
              onClick={() => handleAddSpot(place)}
              disabled={addingId === place.spot_id}
              className="flex-shrink-0 text-sm text-blue-500 hover:text-blue-700 disabled:opacity-40"
            >
              {addingId === place.spot_id ? "Adding…" : "Add"}
            </button>
          )}
        />
      )}
    </div>
  );
}
