"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import { TopNavigation } from "../../components/ui/TopNavigation";
import { Smiley, Arrow } from "../../components/ui/stickers";
import { TextInput } from "../../components/ui/inputs";
import { Button } from "../../components/ui/Button";
import { IconButton } from "../../components/ui/IconButton";
import { ArrowRight } from "../../components/ui/icons/ArrowRight";
import { Google } from "../../components/ui/icons/Google";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      console.log(`SIGNING IN!!! ${email} | ${password}`);
      // Try to sign in first
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (!signInError && signInData.user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", signInData.user.id)
          .single();

        if (profileError || !profile) {
          router.push("/create-account");
          return;
        }

        router.push(`/${profile.username}`);
        return;
      }

      if (
        signInError &&
        signInError.message.includes("Invalid login credentials")
      ) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (signUpError) throw signUpError;

        router.push("/create-account");
        return;
      }

      throw signInError;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col bg-black overflow-hidden lg:grid lg:grid-cols-[2fr_3fr] ">
      {/* Left column */}
      <div className="relative flex flex-col min-h-screen overflow-hidden ">
        <TopNavigation
          variant="logo-only"
          theme="dark"
          className="relative z-10"
        />

        {/* Body — content pushed to bottom */}
        <div className="flex flex-1 flex-col justify-end gap-9 p-[var(--space-page)] pb-30 relative z-10">
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
            <p className="text-body-sm">
              {showPassword
                ? "Enter your password to continue"
                : "It's time to discover new spots around you and share your favorites in your own city playlists!"}
            </p>
          </div>

          {/* Auth options */}
          <div className="flex flex-col gap-3">
            {/* Google */}
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

            {/* Email form */}
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
                className="text-body-sm text-white/50 hover:text-white/80 transition-colors text-left"
              >
                ← Use a different email
              </button>
            )}

            {error && <p className="text-body-sm text-red-400">{error}</p>}
          </div>
        </div>
      </div>
      {/* Right column */}
      <div className="py-2 pr-2">
        <div className="bg-grey/20 h-full w-full rounded-sm"></div>
      </div>
    </main>
  );
}
