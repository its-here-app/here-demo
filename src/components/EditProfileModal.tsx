"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../lib/authContext";
import { FullLogo } from "./ui/Logo";
import { Close } from "./ui/icons/Close";
import { Camera } from "./ui/icons/Camera";
import { Check } from "./ui/icons/Check";
import { TextInput } from "./ui/inputs/TextInput";
import { BottomPanel } from "./ui/BottomPanel";
import {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
} from "@/lib/services/users";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}



export default function EditProfileModal({
  isOpen,
  onClose,
  onSuccess,
}: EditProfileModalProps) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string>("");

  useEffect(() => {
    if (isOpen && user) {
      loadProfile();
    }
  }, [isOpen, user]);


  async function loadProfile() {
    if (!user) return;
    try {
      const profile = await getProfile(user.id);
      if (profile) {
        setName(profile.full_name || "");
        setUsername(profile.username || "");
        setBio(profile.bio || "");
        setCurrentPhotoUrl(profile.avatar_url || "");
        setPhotoPreview(profile.avatar_url || "");
      }
    } catch {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError("");

    try {
      let photoUrl = currentPhotoUrl;

      if (profilePhoto) {
        photoUrl = await uploadProfilePhoto(user.id, profilePhoto, currentPhotoUrl);
      }

      await updateProfile(user.id, {
        full_name: name,
        username,
        bio,
        avatar_url: photoUrl,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // ─── Shared form body ──────────────────────────────────────────────────────

  const formBody = (
    <>
      {/* Avatar */}
      <div className="flex justify-center">
        <label className="relative size-[98px] rounded-full cursor-pointer shrink-0">
          <div className="size-full rounded-full overflow-hidden bg-white/10">
            {photoPreview && (
              <img src={photoPreview} alt="Profile" className="size-full object-cover" />
            )}
          </div>
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
            <Camera className="text-white size-9" />
          </div>
          <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
        </label>
      </div>

      <TextInput
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Your full name"
        state={name ? "filled" : "default"}
      />

      <TextInput
        label="Username"
        value={username}
        onChange={(e) =>
          setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
        }
        required
        placeholder="username"
        state={username ? "filled" : "default"}
        rightSlot={username ? <Check focus className="text-white group-focus-within:text-neon" /> : undefined}
      />

      <TextInput
        label="Bio (optional)"
        size="tall"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        maxLength={150}
        placeholder="Tell us something about yourself..."
        state={bio ? "filled" : "default"}
      />

      {/* Delete account */}
      <div className="flex justify-center">
        <button
          type="button"
          className="border border-white/15 rounded-lg h-10 px-[14px] text-body-xs text-[#ff383c]"
        >
          Delete account
        </button>
      </div>

      {error && (
        <p className="text-body-xs text-[#ff383c] text-center">{error}</p>
      )}
    </>
  );

  return (
    <>
      {/* ── Mobile: bottom sheet ─────────────────────────────────────────── */}
      <BottomPanel
        isOpen={isOpen}
        onClose={onClose}
        title="Edit profile"
        footer={
          <button
            type="submit"
            form="edit-profile-form"
            disabled={saving}
            className="bg-white/15 rounded-lg h-10 w-full text-body-xs text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        }
      >
        <form id="edit-profile-form" onSubmit={handleSubmit}>
          {loading ? (
            <p className="text-body-sm text-white/50 text-center py-8">Loading...</p>
          ) : (
            formBody
          )}
        </form>
      </BottomPanel>

      {/* ── Desktop: full-screen black overlay ──────────────────────────── */}
      {isOpen && <form
        onSubmit={handleSubmit}
        className="hidden lg:flex flex-col h-full bg-black overflow-y-auto fixed inset-0 z-[60]"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 pt-8 shrink-0">
          <FullLogo className="brightness-0 invert" />
          <button type="button" onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <Close />
          </button>
        </div>

        {/* Centered content */}
        <div className="flex-1 flex flex-col items-center justify-center gap-[60px] py-12">
          <p className="text-body-sm text-[#fffbf7] text-center">Edit profile</p>

          {loading ? (
            <p className="text-body-sm text-white/50">Loading...</p>
          ) : (
            <>
              <div className="flex flex-col gap-4 w-[366px]">{formBody}</div>
              <button
                type="submit"
                disabled={saving}
                className="bg-white/15 rounded-2xl h-[54px] px-5 text-body-sm text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </>
          )}
        </div>
      </form>}
    </>
  );
}
