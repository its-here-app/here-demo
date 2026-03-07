"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/authContext";
import { Camera } from "./ui/icons/Camera";
import { Check } from "./ui/icons/Check";
import { TextInput } from "./ui/inputs/TextInput";
import { BottomPanel } from "./ui/BottomPanel";
import { Button } from "./ui/Button";
import {
  getProfile,
  getUserByUsername,
  updateProfile,
  uploadProfilePhoto,
} from "@/lib/services/users";

type UsernameStatus = "idle" | "checking" | "valid" | "taken";

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
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [initialUsername, setInitialUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string>("");

  useEffect(() => {
    if (isOpen && user) {
      loadProfile();
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (username.length < 3) {
      setUsernameStatus("idle");
      return;
    }
    if (username === initialUsername) {
      setUsernameStatus("valid");
      return;
    }
    setUsernameStatus("checking");
    const timer = setTimeout(async () => {
      const existing = await getUserByUsername(username);
      setUsernameStatus(existing ? "taken" : "valid");
    }, 500);
    return () => clearTimeout(timer);
  }, [username]);

  async function loadProfile() {
    if (!user) return;
    try {
      const profile = await getProfile(user.id);
      if (profile) {
        setName(profile.full_name || "");
        const loadedUsername = profile.username || "";
        setUsername(loadedUsername);
        setInitialUsername(loadedUsername);
        setUsernameStatus(loadedUsername.length >= 3 ? "valid" : "idle");
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
        photoUrl = await uploadProfilePhoto(
          user.id,
          profilePhoto,
          currentPhotoUrl,
        );
      }

      await updateProfile(user.id, {
        full_name: name,
        username,
        bio,
        avatar_url: photoUrl,
      });

      if (username !== initialUsername) {
        router.push(`/${username}`);
      } else {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const formBody = (
    <>
      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <label className="relative size-[6.125rem] rounded-full cursor-pointer shrink-0">
          <div className="size-full rounded-full overflow-hidden bg-white/10">
            {photoPreview && (
              <img
                src={photoPreview}
                alt="Profile"
                className="size-full object-cover"
              />
            )}
          </div>
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
            <Camera className="text-white size-9" />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
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
        state={usernameStatus === "valid" ? "filled" : "default"}
        rightSlot={
          usernameStatus === "valid" ? (
            <Check focus className="text-neon" />
          ) : undefined
        }
      />

      {usernameStatus === "taken" && (
        <p className="text-body-xs text-danger">Username is taken</p>
      )}

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
        <Button
          type="button"
          variant="outline"
          size="md"
          darkTheme
          className="!text-danger"
        >
          Delete account
        </Button>
      </div>

      {/* Desktop save button */}
      <div className="hidden lg:flex justify-center pt-[calc(3.75rem-1rem)]">
        <Button
          type="submit"
          variant="tonal"
          size="lg"
          darkTheme
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      {error && (
        <p className="text-body-xs text-danger text-center">{error}</p>
      )}
    </>
  );

  return (
    <BottomPanel
      isOpen={isOpen}
      onClose={onClose}
      title="Edit profile"
      desktopVariant="full-page"
      footer={
        <Button
          type="submit"
          form="edit-profile-form"
          variant="tonal"
          size="md"
          darkTheme
          disabled={saving}
          className="w-full"
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      }
    >
      <form
        id="edit-profile-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        {loading ? (
          <p className="text-body-sm text-white/50 text-center py-8">
            Loading...
          </p>
        ) : (
          formBody
        )}
      </form>
    </BottomPanel>
  );
}
