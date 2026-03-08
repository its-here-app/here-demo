"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/authContext";
import { createClient } from "../../lib/supabase/client";
import { NavBar } from "../../components/ui/NavBar";
import { Smiley, Arrow } from "../../components/ui/stickers";
import { TextInput } from "../../components/ui/inputs";
import { Button } from "../../components/ui/Button";
import { IconButton } from "../../components/ui/IconButton";
import { ArrowRight } from "../../components/ui/icons/ArrowRight";
import { Google } from "../../components/ui/icons/Google";
import { Camera } from "../../components/ui/icons/Camera";
import { Check } from "../../components/ui/icons/Check";
import { FullLogo } from "../../components/ui/Logo";

import { getUserByUsername } from "../../lib/services/users";

type Step = "auth" | "profile";
type UsernameStatus = "idle" | "checking" | "valid" | "taken";

export default function LoginPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  // Auth step
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Multi-step
  const [step, setStep] = useState<Step>("auth");

  // Profile step
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [saving, setSaving] = useState(false);

  // Handle returning from Google OAuth or already-authenticated users
  useEffect(() => {
    if (authLoading || !user || step === "profile") return;

    supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single()
      .then(({ data: profile }) => {
        if (profile?.username) {
          router.push(`/${profile.username}`);
        } else {
          if (user.user_metadata?.full_name || user.user_metadata?.name) {
            setName(user.user_metadata.full_name ?? user.user_metadata.name);
          }
          setStep("profile");
        }
      });
  }, [user?.id, authLoading]);

  // Debounced username uniqueness check
  useEffect(() => {
    if (username.length < 3) {
      setUsernameStatus("idle");
      return;
    }
    setUsernameStatus("checking");
    const timer = setTimeout(async () => {
      const existing = await getUserByUsername(username);
      setUsernameStatus(existing ? "taken" : "valid");
    }, 500);
    return () => clearTimeout(timer);
  }, [username]);

  async function handleGoogleSignIn() {
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  async function handleEmailContinue(e: React.FormEvent) {
    e.preventDefault();
    setShowPassword(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (!signInError && signInData.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", signInData.user.id)
          .single();

        if (!profile?.username) {
          setStep("profile");
          return;
        }

        router.push(`/${profile.username}`);
        return;
      }

      if (signInError?.message.includes("Invalid login credentials")) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (signUpError) throw signUpError;

        setStep("profile");
        return;
      }

      throw signInError;
    } catch (err: any) {
      setError(err.message);
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

  async function handleCancel() {
    await supabase.auth.signOut();
    setStep("auth");
    setName("");
    setUsername("");
    setBio("");
    setProfilePhoto(null);
    setPhotoPreview("");
    setError("");
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError("");

    try {
      let photoUrl = null;

      if (profilePhoto) {
        const fileExt = profilePhoto.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("profile-photos")
          .upload(fileName, profilePhoto);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("profile-photos").getPublicUrl(fileName);

        photoUrl = publicUrl;
      }

      const { error: dbError } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        full_name: name,
        username,
        bio,
        avatar_url: photoUrl,
      });

      if (dbError) throw dbError;

      router.push(`/${username}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (authLoading) {
    return <main className="h-screen bg-black" />;
  }

  return (
    <main className="relative flex h-screen flex-row bg-black overflow-hidden">
      {/* Left column */}
      <div className="relative flex flex-col h-full overflow-hidden flex-1 min-w-0">
        <div className="p-[var(--space-page)] flex flex-row items-center justify-between">
          <FullLogo className="w-20" color="white" />
          {step === "profile" ? (
            <button
              type="button"
              onClick={handleCancel}
              className="text-body-sm text-white/50 hover:text-white/80 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          ) : undefined}
        </div>

        <div className="relative flex-1 overflow-hidden">
          {/* ── Auth panel ── */}
          <div
            className={`absolute inset-0 flex flex-col justify-end gap-9 p-[var(--space-page)] pb-30 z-10 transition-transform duration-600 ease-in-out ${
              step === "auth" ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Stickers */}
            <div className="absolute top-6 right-16 pointer-events-none">
              <Smiley color="outline" size={127} />
            </div>
            <div className="absolute top-31 right-7 pointer-events-none">
              <Arrow color="cream" size={84} className="-rotate-45" />
            </div>

            {/* Title */}
            <div className="flex flex-col gap-4 text-white">
              <h1 className="text-display-radio-1">
                Sign in <div>or sign up</div>
              </h1>
              <p className="text-body-sm max-w-[22rem]">
                {showPassword
                  ? "Enter your password to continue"
                  : "It's time to discover new spots around you and share your favorites in your own city playlists!"}
              </p>
            </div>

            {/* Auth options */}
            <div className="flex flex-col gap-3">
              <Button
                variant="tonal"
                size="lg"
                darkTheme
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full"
                leftIcon={<Google className="w-5 h-5" />}
              >
                Continue with Google
              </Button>

              <form
                onSubmit={showPassword ? handleSubmit : handleEmailContinue}
                className="flex flex-col gap-3"
              >
                <TextInput
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={showPassword}
                  placeholder="Your email"
                  state={showPassword ? "filled" : "default"}
                  rightSlot={
                    <IconButton
                      type="submit"
                      variant="brand"
                      label="Continue"
                      disabled={loading}
                      icon={<ArrowRight />}
                    />
                  }
                />

                {showPassword && (
                  <TextInput
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                    placeholder="Password"
                    state="default"
                  />
                )}
              </form>

              {showPassword && (
                <button
                  type="button"
                  onClick={() => {
                    setShowPassword(false);
                    setPassword("");
                    setError("");
                  }}
                  className="text-body-sm text-white/50 hover:text-white/80 transition-colors text-left cursor-pointer"
                >
                  ← Use a different email
                </button>
              )}

              {error && <p className="text-body-sm text-red-400">{error}</p>}
            </div>
          </div>

          {/* ── Profile panel ── */}
          <div
            className={`absolute inset-0 flex flex-col items-center gap-12 pt-12 px-[var(--space-page)] transition-transform duration-600 ease-in-out ${
              step === "profile" ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="text-center text-white">
              <h1 className="text-display-radio-2 mb-2">Welcome</h1>
              <p className="text-body-sm">Let’s start with some basics</p>
            </div>

            <form
              id="profile-form"
              onSubmit={handleProfileSubmit}
              className="flex flex-col gap-2 w-full max-w-[22.875rem]"
            >
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
                aria-label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                state={name ? "filled" : "default"}
              />

              <TextInput
                aria-label="Username"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                  )
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
                aria-label="Bio"
                size="tall"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={150}
                placeholder="Tell us something about yourself... (Optional bio)"
                state={bio ? "filled" : "default"}
              />

              {error && (
                <p className="text-body-xs text-danger text-center">{error}</p>
              )}

              {/* Desktop: Get started inside form flow */}
              <div className="hidden lg:flex pt-[calc(3.75rem-1rem)]">
                <Button
                  type="submit"
                  variant="filled"
                  size="lg"
                  darkTheme
                  disabled={saving || !name || usernameStatus !== "valid"}
                  className="w-full"
                >
                  {saving ? "Saving..." : "Done"}
                </Button>
              </div>
            </form>

            {/* Mobile: Get started pinned to bottom */}
            <div className="lg:hidden absolute bottom-8 left-0 right-0 flex justify-center px-[var(--space-page)]">
              <Button
                type="submit"
                form="profile-form"
                variant="filled"
                size="lg"
                darkTheme
                disabled={saving || !name || usernameStatus !== "valid"}
                className="w-full max-w-[22.875rem]"
              >
                {saving ? "Saving..." : "Done"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right column — grows in horizontally at lg */}
      <div className="overflow-hidden shrink-0 h-full w-0 lg:w-[60%] transition-[width] duration-400 ease-out">
        <div className="h-full w-[60vw] py-[var(--space-page-sm)] pr-[var(--space-page-sm)]">
          <div className="bg-grey/20 h-full w-full rounded-sm" />
        </div>
      </div>
    </main>
  );
}
