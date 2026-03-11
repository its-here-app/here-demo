"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/authContext";
import { Avatar } from "../ui/Avatar";
import { Sheet } from "../ui/Sheet";
import { Check } from "../ui/icons/Check";
import { Error } from "../ui/icons/Error";
import { toast } from "../ui/Toast";
import { TextInput } from "../ui/inputs/TextInput";
import { BottomPanel } from "../ui/BottomPanel";
import { Button } from "../ui/Button";
import {
  getProfile,
  getUserByUsername,
  updateProfile,
  uploadProfilePhoto,
} from "@/lib/services/users";

type UsernameStatus = "idle" | "too-short" | "checking" | "valid" | "taken";

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

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [initialUsername, setInitialUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string>("");
  const [isPhotoSheetOpen, setIsPhotoSheetOpen] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const captureInputRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && user) {
      loadProfile();
    }
  }, [isOpen, user]);

  useEffect(() => {
    setHasCamera(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  function handleAvatarClick() {
    if (hasCamera || photoPreview) {
      setIsPhotoSheetOpen((s) => !s);
    } else {
      uploadInputRef.current?.click();
    }
  }

  function handleRemovePhoto() {
    setProfilePhoto(null);
    setPhotoPreview("");
    setCurrentPhotoUrl("");
  }

  useEffect(() => {
    if (username.length === 0) {
      setUsernameStatus("idle");
      return;
    }
    if (username.length < 3) {
      const timer = setTimeout(() => setUsernameStatus("too-short"), 800);
      return () => clearTimeout(timer);
    }
    if (username === initialUsername) {
      setUsernameStatus("valid");
      return;
    }
    setUsernameStatus("checking");
    const timer = setTimeout(async () => {
      const existing = await getUserByUsername(username);
      setUsernameStatus(existing ? "taken" : "valid");
    }, 800);
    return () => clearTimeout(timer);
  }, [username]);

  useEffect(() => {
    if (usernameStatus === "too-short") {
      toast({
        icon: <Error />,
        message: "Username must be at least 3 characters",
      });
    } else if (usernameStatus === "taken") {
      toast({
        icon: <Error />,
        message: "Username already taken, please try another",
      });
    }
  }, [usernameStatus]);

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
      toast({ icon: <Error />, message: "Failed to load profile" });
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
      toast({ icon: <Error />, message: err.message });
    } finally {
      setSaving(false);
    }
  }

  const formBody = (
    <>
      {/* Avatar */}
      <div className="flex justify-center">
        <div
          ref={(el) => {
            if (!el) {
              avatarRef.current = null;
              return;
            }
            if (el.getBoundingClientRect().width > 0) avatarRef.current = el;
          }}
          className="relative cursor-pointer"
          onClick={handleAvatarClick}
        >
          <Avatar size="xl" editIcon src={photoPreview || undefined} />
        </div>
        <input
          ref={uploadInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />
        <input
          ref={captureInputRef}
          type="file"
          accept="image/*"
          capture="user"
          onChange={handlePhotoChange}
          className="hidden"
        />
      </div>

      <Sheet
        isOpen={isPhotoSheetOpen}
        onClose={() => setIsPhotoSheetOpen(false)}
        anchorRef={avatarRef}
        title="Change photo"
        items={[
          {
            label: "Upload photo",
            onClick: () => {
              setIsPhotoSheetOpen(false);
              uploadInputRef.current?.click();
            },
          },
          ...(hasCamera
            ? [
                {
                  label: "Take photo",
                  onClick: () => {
                    setIsPhotoSheetOpen(false);
                    captureInputRef.current?.click();
                  },
                },
              ]
            : []),
          ...(photoPreview
            ? [
                {
                  label: "Remove photo",
                  onClick: handleRemovePhoto,
                  variant: "danger" as const,
                },
              ]
            : []),
        ]}
      />

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
        minLength={3}
        maxLength={30}
        placeholder="username"
        state={usernameStatus === "valid" ? "filled" : "default"}
        rightSlot={
          usernameStatus === "valid" ? (
            <Check focus className="text-neon" />
          ) : usernameStatus === "too-short" || usernameStatus === "taken" ? (
            <Error className="text-neon" />
          ) : undefined
        }
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
    </>
  );

  return (
    <BottomPanel
      isOpen={isOpen}
      onClose={onClose}
      header="Edit profile"
      desktopVariant="full-page"
      footer={
        <Button
          type="submit"
          form="edit-profile-form"
          variant="tonal"
          size="md"
          darkTheme
          disabled={saving || usernameStatus === "too-short" || usernameStatus === "taken" || usernameStatus === "checking"}
          className="w-full"
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      }
      desktopFooter={
        <Button
          type="submit"
          form="edit-profile-form"
          variant="tonal"
          size="lg"
          darkTheme
          disabled={saving || usernameStatus === "too-short" || usernameStatus === "taken" || usernameStatus === "checking"}
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
