import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import klexLogo from "@/assets/klex-logo.png.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — KLEX" },
      {
        name: "description",
        content:
          "Sign in or create your KLEX account to track orders and check out faster.",
      },
      { property: "og:title", content: "Sign In — KLEX" },
      {
        property: "og:description",
        content:
          "Sign in or create your KLEX account to track orders and check out faster.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (!loading && user) {
    navigate({ to: "/", replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: displayName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        if (!data.session) {
          setConfirmationSent(true);
          return;
        }
        toast.success("Welcome to KLEX!");
        navigate({ to: "/", replace: true });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate({ to: "/", replace: true });
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Try again.");
      setGoogleLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={klexLogo.url}
              alt="KLEX"
              className="h-6 w-auto"
              width={938}
              height={301}
            />
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          {confirmationSent ? (
            <div className="rounded-2xl border border-white/10 bg-ink2 p-8 text-center">
              <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-bone">
                Check your email
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-ash">
                We sent a confirmation link to{" "}
                <span className="text-bone">{email}</span>. Click it to
                activate your account, then come back and sign in.
              </p>
              <button
                onClick={() => {
                  setConfirmationSent(false);
                  setMode("signin");
                }}
                className="mt-8 w-full rounded-[10px] bg-oxblood px-6 py-3 font-display text-sm font-medium uppercase tracking-[0.14em] text-bone transition-transform hover:-translate-y-0.5"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-ink2 p-8">
              <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-bone">
                {mode === "signin" ? "Welcome back" : "Join KLEX"}
              </h1>
              <p className="mt-2 text-sm text-ash">
                {mode === "signin"
                  ? "Sign in to your account."
                  : "Create an account to check out faster."}
              </p>

              <button
                onClick={handleGoogle}
                disabled={googleLoading || submitting}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-[10px] border border-white/15 bg-ink px-6 py-3 text-sm font-medium text-bone transition-colors hover:border-bone/40 disabled:opacity-60"
              >
                {googleLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <svg className="size-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5.04c1.62 0 3.06.56 4.2 1.64l3.12-3.12C17.46 1.8 14.96.72 12 .72 7.44.72 3.56 3.34 1.7 7.32l3.66 2.84C6.24 7.14 8.88 5.04 12 5.04z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.28 12.26c0-.79-.07-1.54-.2-2.26H12v4.51h6.34c-.27 1.47-1.1 2.72-2.34 3.55l3.62 2.81c2.12-1.96 3.66-4.85 3.66-8.61z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.36 14.28a7.2 7.2 0 0 1 0-4.56L1.7 6.88a11.28 11.28 0 0 0 0 10.24l3.66-2.84z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23.28c3.04 0 5.6-1 7.46-2.72l-3.62-2.81c-1 .68-2.3 1.08-3.84 1.08-3.12 0-5.76-2.1-6.64-4.99l-3.66 2.84c1.86 3.98 5.74 6.6 10.3 6.6z"
                    />
                  </svg>
                )}
                Continue with Google
              </button>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-ash">
                  or
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <label
                      htmlFor="displayName"
                      className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-ash"
                    >
                      Name
                    </label>
                    <input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                      className="w-full rounded-[10px] border border-white/15 bg-ink px-4 py-3 text-sm text-bone outline-none transition-colors placeholder:text-ash/50 focus:border-oxblood"
                      placeholder="Your name"
                    />
                  </div>
                )}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-ash"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-[10px] border border-white/15 bg-ink px-4 py-3 text-sm text-bone outline-none transition-colors placeholder:text-ash/50 focus:border-oxblood"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-ash"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full rounded-[10px] border border-white/15 bg-ink px-4 py-3 text-sm text-bone outline-none transition-colors placeholder:text-ash/50 focus:border-oxblood"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting || googleLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-oxblood px-6 py-3 font-display text-sm font-medium uppercase tracking-[0.14em] text-bone ring-1 ring-oxblood/50 transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
                  {mode === "signin" ? "Sign in" : "Create account"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-ash">
                {mode === "signin" ? (
                  <>
                    New here?{" "}
                    <button
                      onClick={() => setMode("signup")}
                      className="text-oxblood transition-colors hover:text-bone"
                    >
                      Create an account
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => setMode("signin")}
                      className="text-oxblood transition-colors hover:text-bone"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
