"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  UserRound,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/provider";
import { authenticate, saveSession } from "@/lib/auth";
import { cn } from "@/lib/cn";

export function LoginForm() {
  const { t } = useLanguage();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);

  const enter = (
    userUsername: string,
    userPassword: string,
    rememberMe: boolean,
  ) => {
    const session = authenticate(userUsername, userPassword, "admin");

    if (!session) {
      setError(t.login.errorInvalid);
      setShakeKey((value) => value + 1);
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      saveSession(session, rememberMe);
      try {
        window.sessionStorage.setItem("bm-intro", "1");
      } catch {
        // Storage can be unavailable; the dashboard simply skips the intro.
      }
      router.push("/dashboard");
    }, 650);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError(t.login.errorEmpty);
      setShakeKey((value) => value + 1);
      return;
    }

    enter(username, password, remember);
  };

  const inputClass = (hasError: boolean) =>
    cn(
      "h-11 w-full rounded-xl border bg-black/20 text-sm text-white placeholder:text-white/50 transition outline-none backdrop-blur-sm sm:h-12",
      "focus:ring-2",
      hasError
        ? "border-white/35 focus:border-white/60 focus:ring-white/15"
        : "border-white/[0.14] hover:border-white/25 focus:border-white/45 focus:ring-white/10",
    );

  return (
    <div className="relative w-full max-w-[440px]">
      <div className="glass-form relative overflow-hidden rounded-[24px] p-4 sm:rounded-[28px] sm:p-6 lg:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 size-48 rounded-full bg-brand-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 size-48 rounded-full bg-accent-500/10 blur-3xl" />

        <h2 className="relative text-center font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
          {t.login.title}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="relative mt-5 space-y-3 sm:mt-7 sm:space-y-4"
          noValidate
        >
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-[11px] font-medium text-slate-400 sm:mb-1.5 sm:text-xs"
            >
              {t.login.username}
            </label>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setError(null);
                }}
                placeholder={t.login.usernamePlaceholder}
                aria-invalid={Boolean(error)}
                className={cn(inputClass(Boolean(error)), "pl-10.5 pr-4")}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-[11px] font-medium text-slate-400 sm:mb-1.5 sm:text-xs"
            >
              {t.login.password}
            </label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError(null);
                }}
                placeholder={t.login.passwordPlaceholder}
                aria-invalid={Boolean(error)}
                className={cn(inputClass(Boolean(error)), "pl-10.5 pr-12")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={t.login.password}
                className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-slate-300"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-0.5">
            <label className="group flex cursor-pointer select-none items-center gap-2.5 text-[11px] text-slate-400 sm:text-xs">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "grid size-4.5 place-items-center rounded-[5px] border transition",
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-brand-400/50",
                  remember
                    ? "border-brand-400 bg-brand-500"
                    : "border-white/15 bg-white/5 group-hover:border-white/25",
                )}
              >
                {remember && (
                  <Check className="size-3 text-night-950" strokeWidth={3.2} />
                )}
              </span>
              {t.login.remember}
            </label>

            <button
              type="button"
              className="text-xs font-medium text-slate-500 transition hover:text-brand-300"
            >
              {t.login.forgot}
            </button>
          </div>

          {error && (
            <div
              key={shakeKey}
              role="alert"
              className="animate-shake flex items-start gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-xs leading-relaxed text-white"
            >
              <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/30 bg-white/[0.06] text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/[0.14] active:scale-[0.99] disabled:cursor-wait disabled:opacity-80 sm:h-12"
          >
            <span className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.45),transparent)] transition-transform duration-700 group-hover:translate-x-[120%]" />
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t.login.signingIn}
              </>
            ) : (
              <>
                {t.login.signIn}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
