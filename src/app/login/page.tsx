"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import { TopNavigation } from "../../components/ui/TopNavigation";
import { Smiley, Arrow } from "../../components/ui/stickers";
import { TextInput } from "../../components/ui/inputs";

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
            <Arrow color="cream" size={84} className="rotate-45" />
          </div>

          {/* Title */}
          <div className="flex flex-col gap-4">
            <h1 className="text-display-radio-1 text-white text-balance">
              Sign in <div>or sign up</div>
            </h1>
            <p className="text-body-sm text-white/80">
              {showPassword
                ? "Enter your password to continue"
                : "It's time to discover new spots around you and share your favorites in your own city playlists!"}
            </p>
          </div>

          {/* Auth options */}
          <div className="flex flex-col gap-3">
            {/* Google */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 h-[50px] w-full rounded-[16px] bg-white/15 text-white text-body-sm transition-opacity hover:opacity-80 active:opacity-70 disabled:opacity-40"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#fff"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#fff"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#fff"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#fff"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

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
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-9 h-9 rounded-full bg-neon flex items-center justify-center transition-opacity hover:opacity-80 active:opacity-70 disabled:opacity-40"
                    aria-label="Continue"
                  >
                    <svg
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.0001 8.50012H0.00012207V7.50012H15.0001V8.50012Z"
                        fill="black"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.2397 13.9123L15.8923 8.00486L15.201 7.28235L9.54831 13.1898L10.2397 13.9123Z"
                        fill="black"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.2356 2.08734L15.8936 8.00039L15.2023 8.7229L9.54422 2.80985L10.2356 2.08734Z"
                        fill="black"
                      />
                    </svg>
                  </button>
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
