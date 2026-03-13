"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { BottomPanel } from "@/components/ui/BottomPanel";
import { TextInput } from "@/components/ui/inputs";
import { GhostInput } from "@/components/ui/inputs/GhostInput";
import { Button } from "@/components/ui/Button";
import { ConfirmSheet } from "@/components/ui/Sheet";
import { snackbar } from "@/components/ui/Snackbar";
import { Error } from "@/components/ui/icons/Error";
import { Photo } from "@/components/ui/icons/Photo";
import { PlaylistCard } from "@/components/PlaylistCard";
import SpotCard from "@/components/SpotCard";
import { getDefaultCover } from "@/lib/playlist-covers";
import {
  resolveSpot,
  upsertSpot,
  addSpotToPlaylist,
  createPlaylist,
  uploadPlaylistCover,
} from "@/lib/services/playlists";
import { getUserUsername } from "@/lib/services/users";
import type { DraftSpot } from "@/types";

// ─── Imperative trigger ───────────────────────────────────────────────────────

type OpenListener = () => void;
const listeners: OpenListener[] = [];

export function openCreatePlaylist() {
  listeners.forEach((fn) => fn());
}

// ─── Random name list ─────────────────────────────────────────────────────────

const PLAYLIST_NAMES = [
  "All time faves",
  "Best of the city",
  "Hidden gems",
  "On repeat",
  "Neighborhood classics",
  "City staples",
  "Forever faves",
  "Must tries",
  "Tried & true",
];

// ─── Component ────────────────────────────────────────────────────────────────

export function CreatePlaylistFlow() {
  const { user } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");

  // UI state
  const [panelOpen, setPanelOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayClosing, setOverlayClosing] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [missingPanelOpen, setMissingPanelOpen] = useState(false);

  // Form state
  const [city, setCity] = useState("");
  const [draftName, setDraftName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [spotsInput, setSpotsInput] = useState("");
  const [foundSpots, setFoundSpots] = useState<DraftSpot[]>([]);
  const [unfoundSpots, setUnfoundSpots] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [saving, setSaving] = useState(false);

  // Cover state
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");

  // Load username
  useEffect(() => {
    if (!user) return;
    getUserUsername(user.id).then((name) => {
      if (name) setUsername(name);
    });
  }, [user?.id]);

  // Listen for imperative open calls
  useEffect(() => {
    const listener: OpenListener = () => setPanelOpen(true);
    listeners.push(listener);
    return () => {
      listeners.splice(listeners.indexOf(listener), 1);
    };
  }, []);

  // Escape key: open cancel confirmation when overlay is open
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setConfirmCancelOpen(true);
    }
    if (overlayOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [overlayOpen]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  function resetState() {
    setCity("");
    setDraftName("");
    setDescription("");
    setIsPublic(false);
    setSpotsInput("");
    setFoundSpots([]);
    setUnfoundSpots([]);
    setImporting(false);
    setSaving(false);
    setCoverFile(null);
    setCoverPreview("");
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  function dismissOverlay(then?: () => void) {
    setOverlayClosing(true);
    document.body.style.overflow = "";
    setTimeout(() => {
      setOverlayOpen(false);
      setOverlayClosing(false);
      then?.();
    }, 250);
  }

  function closePanel() {
    setPanelOpen(false);
    setCity("");
  }

  // ── Step 1: Create ─────────────────────────────────────────────────────────

  function handleCreate() {
    const name =
      PLAYLIST_NAMES[Math.floor(Math.random() * PLAYLIST_NAMES.length)];
    setDraftName(name);
    setPanelOpen(false);
    setOverlayOpen(true);
    document.body.style.overflow = "hidden";
  }

  // ── Import ─────────────────────────────────────────────────────────────────

  async function handleImport() {
    if (!city) return;
    setImporting(true);

    const lines = spotsInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const foundTemp: DraftSpot[] = [];
    const unfoundTemp: string[] = [];

    for (const line of lines) {
      try {
        const match = await resolveSpot(line, city);
        if (match) {
          foundTemp.push({
            google_place_id: match.spot_id,
            name: match.name,
            address: match.address,
            photo_url: match.photo_url,
            rating: match.rating,
            types: match.types,
          });
        } else {
          unfoundTemp.push(line);
        }
      } catch {
        unfoundTemp.push(line);
      }
    }

    setFoundSpots(foundTemp);
    setUnfoundSpots(unfoundTemp);
    setImporting(false);

    if (unfoundTemp.length > 0) {
      snackbar({
        icon: <Error />,
        message: `${unfoundTemp.length} missing spot${unfoundTemp.length === 1 ? "" : "s"}`,
        actionLabel: "See more",
        onAction: () => setMissingPanelOpen(true),
      });
    }
  }

  // ── Save ───────────────────────────────────────────────────────────────────

  async function handleSave() {
    if (!user) return;
    setSaving(true);

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
        name: draftName,
        city,
        slug,
        description,
        is_public: isPublic,
      });

      for (let i = 0; i < foundSpots.length; i++) {
        const spot = foundSpots[i];
        const upserted = await upsertSpot({
          google_place_id: spot.google_place_id,
          name: spot.name,
          address: spot.address,
          photo_url: spot.photo_url,
          rating: spot.rating,
          types: spot.types,
        });
        await addSpotToPlaylist(playlist.id, upserted.id, i, user.id);
      }

      if (coverFile) {
        await uploadPlaylistCover(playlist.id, user.id, coverFile);
      }

      dismissOverlay(() => {
        resetState();
        router.push(`/${username}`);
      });
    } catch (err) {
      console.error("Error creating playlist:", err);
      setSaving(false);
    }
  }

  // ── Discard ────────────────────────────────────────────────────────────────

  function handleDiscard() {
    setConfirmCancelOpen(false);
    dismissOverlay(resetState);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Step 1 — City BottomPanel */}
      <BottomPanel
        isOpen={panelOpen}
        onClose={closePanel}
        header="Create a playlist"
        subheader="Which city are you making a playlist for?"
        mobileHeight="tall"
        centerBody
        desktopVariant="full-page"
        footer={
          <Button
            variant="filled"
            size="md"
            darkTheme
            softDisabled
            disabled={!city.trim()}
            onClick={handleCreate}
            className="w-full"
          >
            Create
          </Button>
        }
        desktopFooter={
          <Button
            variant="filled"
            size="lg"
            darkTheme
            softDisabled
            disabled={!city.trim()}
            onClick={handleCreate}
          >
            Create
          </Button>
        }
      >
        <GhostInput
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && city.trim() && handleCreate()}
          placeholder="New York"
          autoFocus
          className="lg:-mt-[1.5rem]"
        />
      </BottomPanel>

      {/* Steps 3–5 — Create Overlay */}
      {overlayOpen && (
        <div
          className="fixed inset-0 z-50 bg-white overflow-y-auto p-[var(--space-page-sm)] lg:pb-0"
          style={{
            animation: `${overlayClosing ? "fadeOut" : "fadeIn"} 250ms ease forwards`,
          }}
        >
          <div className="w-full lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">
            {/* Left — PlaylistCard */}
            <div className="relative mb-6 lg:mb-0 lg:sticky lg:top-0 lg:h-[calc(100vh-2*var(--space-page-sm))]">
              <PlaylistCard
                className="h-[30rem] lg:h-full"
                size="hero"
                image={coverPreview || getDefaultCover(city)}
                city={city}
                name={draftName}
                onNameChange={setDraftName}
                topLeft={
                  <button
                    onClick={() => setConfirmCancelOpen(true)}
                    className="text-body-xs text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                }
                topCenter={
                  <p className="text-body-sm-bold text-white">New playlist</p>
                }
                topRight={
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="text-body-xs text-white cursor-pointer disabled:opacity-50"
                  >
                    {saving ? "Saving…" : "Done"}
                  </button>
                }
                bottomCenter={
                  <Button
                    variant="overlay"
                    size="sm"
                    leftIcon={<Photo />}
                    onClick={() => coverInputRef.current?.click()}
                  >
                    Change cover photo
                  </Button>
                }
              />
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleCoverChange}
              />
            </div>

            {/* Right — Form */}
            <div className="pb-[var(--space-page-sm)]">
              <div className="space-y-4 mb-6">
                <TextInput
                  label="Add spots (one per line)"
                  size="tall"
                  lightMode
                  value={spotsInput}
                  onChange={(e) => setSpotsInput(e.target.value)}
                  placeholder={`Blue Bottle Coffee\nTartine Bakery\nGolden Gate Park`}
                />

                {/* Public / Private toggle */}
                <button
                  onClick={() => setIsPublic((p) => !p)}
                  className="text-body-xs text-secondary cursor-pointer"
                >
                  {isPublic ? "Public" : "Private"} — tap to change
                </button>
                <div>
                  <Button
                    variant="tonal"
                    size="md"
                    onClick={handleImport}
                    disabled={importing || !spotsInput.trim()}
                  >
                    {importing ? "Importing…" : "Import"}
                  </Button>
                </div>
              </div>

              {/* Found spots */}
              {foundSpots.length > 0 && (
                <div className="space-y-3">
                  {foundSpots.map((spot) => (
                    <SpotCard key={spot.google_place_id} spot={spot} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel confirmation */}
      <ConfirmSheet
        isOpen={confirmCancelOpen}
        onClose={() => setConfirmCancelOpen(false)}
        items={[
          { label: "Keep editing", onClick: () => {} },
          { label: "Discard", onClick: handleDiscard, variant: "danger" },
        ]}
      />

      {/* Missing spots BottomPanel */}
      <BottomPanel
        isOpen={missingPanelOpen}
        onClose={() => setMissingPanelOpen(false)}
        header="Missing spots"
        desktopVariant="floating"
      >
        <div className="space-y-3">
          <p className="text-body-xs text-tertiary">
            We couldn&apos;t find a few of the spots
          </p>
          <ul className="text-primary text-body-sm list-disc pl-4">
            {unfoundSpots.map((name) => (
              <li key={name} className="">
                {name}
              </li>
            ))}
          </ul>
        </div>
      </BottomPanel>
    </>
  );
}
