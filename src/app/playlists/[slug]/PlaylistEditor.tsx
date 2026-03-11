"use client";

import { useState, useRef } from "react";
import { useShare } from "@/lib/useShare";
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
import { Avatar } from "@/components/ui/Avatar";
import { PlaylistCard } from "@/components/PlaylistCard";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Close } from "@/components/ui/icons/Close";
import { Edit } from "@/components/ui/icons/Edit";
import { Overflow } from "@/components/ui/icons/Overflow";
import { Photo } from "@/components/ui/icons/Photo";
import { Share } from "@/components/ui/icons/Share";
import { Trash } from "@/components/ui/icons/Trash";
import { Sheet, ConfirmSheet } from "@/components/ui/Sheet";
import { snackbar } from "@/components/ui/Snackbar";
import type { SheetItem } from "@/components/ui/Sheet";
import SpotCard from "@/components/SpotCard";
import { TextInput } from "@/components/ui/inputs";
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
  fromNew?: boolean;
  onClose?: (pushTo?: string) => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
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
    <div ref={setNodeRef} style={style} className="">
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

export default function PlaylistEditor({
  playlist,
  isOwner,
  fromNew,
  onClose,
}: Props) {
  const { user } = useAuth();
  const router = useRouter();

  const [editMode, setEditMode] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [coverUrl, setCoverUrl] = useState<string>(
    playlist.cover_photo_url ?? getDefaultCover(playlist.city),
  );
  const [uploadingCover, setUploadingCover] = useState(false);
  const [description, setDescription] = useState<string>(
    playlist.description ?? "",
  );
  const [spots, setSpots] = useState<PlaylistSpot[]>(
    [...playlist.playlist_spots].sort(
      (a: PlaylistSpot, b: PlaylistSpot) =>
        (a.position ?? 0) - (b.position ?? 0),
    ),
  );
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const overflowRef = useRef<HTMLButtonElement>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const { canShare, share } = useShare();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
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
      reordered.map((s, i) => ({ id: s.id, position: i })),
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
      const ps = await addSpotToPlaylist(
        playlist.id,
        spot.id,
        spots.length,
        user?.id ?? "",
      );
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

  function handleDeletePlaylist() {
    const id = playlist.id;
    const username = playlist.profiles.username;
    const userId = user?.id ?? "";

    const timer = setTimeout(async () => {
      await deletePlaylist(id, userId);
      router.replace(`/${username}`);
    }, 6000);

    snackbar({
      icon: <Trash />,
      message: `${playlist.city} ${playlist.name} deleted`,
      actionLabel: "Undo",
      onAction: () => {
        clearTimeout(timer);
        router.replace(`/${username}`);
      },
    });

    onClose?.(`/${username}?pendingDelete=${id}`);
  }

  function handleExitEdit() {
    setEditMode(false);
    setError("");
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const url = await uploadPlaylistCover(
        playlist.id,
        user?.id ?? "",
        file,
        coverUrl,
      );
      setCoverUrl(url);
    } catch {
      setError("Failed to upload cover photo.");
    } finally {
      setUploadingCover(false);
    }
  }

  return (
    <div className="w-full lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">
      {/* Cover photo */}
      <div className="relative mb-6 lg:mb-0 lg:sticky lg:top-0 lg:h-[calc(100vh-2*var(--space-page-sm))]">
        <PlaylistCard
          className="h-[30rem] lg:h-full"
          size="hero"
          image={coverUrl}
          city={playlist.city}
          name={playlist.name}
          topLeft={
            editMode ? (
              <button
                onClick={handleExitEdit}
                className="text-body-xs text-white cursor-pointer"
              >
                Cancel
              </button>
            ) : (
              <IconButton
                variant="overlay"
                icon={<Close />}
                label="Close"
                onClick={() =>
                  onClose
                    ? onClose()
                    : fromNew
                      ? router.push(`/${playlist.profiles.username}`)
                      : router.back()
                }
              />
            )
          }
          topCenter={
            editMode ? (
              <p className="text-body-sm-bold text-white">Edit playlist</p>
            ) : undefined
          }
          topRight={
            editMode ? (
              <button
                onClick={handleExitEdit}
                className="text-body-xs text-white cursor-pointer"
              >
                Done
              </button>
            ) : isOwner ? (
              <IconButton
                variant="overlay"
                icon={<Overflow orientation="horizontal" />}
                label="More options"
                ref={overflowRef}
                onClick={() => setIsSheetOpen(s => !s)}
              />
            ) : (
              <div className="text-white flex items-center gap-2">
                <BookmarkButton playlistId={playlist.id} variant="overlay" />
                {canShare && (
                  <IconButton
                    variant="overlay"
                    icon={<Share />}
                    label="Share"
                    onClick={() => share(`${window.location.origin}/playlists/${playlist.slug}`)}
                  />
                )}
              </div>
            )
          }
          bottomLeft={
            editMode ? undefined : (
              <Link
                href={`/${playlist.profiles.username}`}
                className="flex items-center gap-2 lg:gap-3 cursor-pointer"
              >
                <Avatar size="sm" lgSize="md" src={playlist.profiles.avatar_url ?? undefined} />
                <p className="text-neon text-body-xs">
                  {playlist.profiles.username}
                </p>
              </Link>
            )
          }
          bottomCenter={
            editMode ? (
              <Button
                variant="overlay"
                size="sm"
                leftIcon={<Photo />}
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingCover}
              >
                {uploadingCover ? "Uploading…" : "Change cover photo"}
              </Button>
            ) : undefined
          }
          bottomRight={
            editMode ? undefined : (
              <p className="text-neon text-body-xs">
                Last updated {timeAgo(playlist.updated_at)}
              </p>
            )
          }
        />
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleCoverUpload}
        />
      </div>

      {/* Right column */}
      <div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              {editMode ? (
                <TextInput
                  size="tall"
                  lightMode
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={(e) => handleDescriptionBlur(e.target.value)}
                  placeholder="Add a description…"
                  className="mb-4"
                />
              ) : (
                description && (
                  <p className="text-gray-600 mb-4">{description}</p>
                )
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <p>{spots.length} spots</p>
                <p>•</p>
                <p>{playlist.is_public ? "Public" : "Private"}</p>
              </div>
            </div>
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
      {/* end right column */}

      {isOwner && (
        <Sheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          anchorRef={overflowRef}
          align="end"
          title="Options"
          items={
            [
              ...(canShare ? [{ label: "Share", onClick: () => share(`${window.location.origin}/playlists/${playlist.slug}`), icon: <Share /> }] : []),
              {
                label: "Edit",
                onClick: () => {
                  setIsSheetOpen(false);
                  setEditMode(true);
                },
                icon: <Edit />,
              },
              {
                label: "Delete playlist",
                onClick: () => setIsConfirmDeleteOpen(true),
                variant: "danger" as const,
                icon: <Trash />,
              },
            ] satisfies SheetItem[]
          }
        />
      )}

      <ConfirmSheet
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        items={[
          { label: "Never mind", onClick: () => {} },
          {
            label: "Yes, delete",
            onClick: handleDeletePlaylist,
            variant: "danger",
          },
        ]}
      />
    </div>
  );
}
