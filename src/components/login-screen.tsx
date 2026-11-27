"use client";

import { Logo } from "@/components/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LoginForm } from "@/components/login-form";
import { BusScene } from "@/components/bus-scene";
import { IntroCurtain } from "@/components/intro-curtain";
import { useLanguage } from "@/lib/i18n/provider";

export function LoginScreen() {
  const { t } = useLanguage();

  return (
    <main className="login-scope relative flex h-dvh max-h-dvh w-full flex-col overflow-hidden overscroll-none bg-night-950 lg:block">
      <div className="pointer-events-none fixed inset-0">
        <div className="login-fon absolute inset-0" />
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[8px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_16%_14%,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_84%_86%,rgba(205,200,192,0.05),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1500px] flex-col lg:grid lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex min-h-0 flex-1 flex-col px-5 pb-2 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8 sm:pt-6 lg:h-full lg:px-14 lg:py-8 xl:px-20">
          <header className="animate-fade-in relative z-20 flex shrink-0 items-center justify-between gap-4">
            <Logo className="min-w-0" />
            <LanguageSwitcher className="shrink-0 lg:hidden" compact glass />
          </header>

          <div className="mt-4 shrink-0 sm:mt-7 lg:mt-20">
            <h1
              className="animate-fade-up mt-0 max-w-[620px] font-display text-[26px] font-extrabold leading-[1.08] tracking-tight text-white sm:mt-5 sm:text-[38px] xl:text-[46px]"
              style={{ animationDelay: "150ms" }}
            >
              {t.hero.title1}
              <br />
              <span className="bg-gradient-to-r from-brand-300 via-accent-400 to-brand-300 bg-clip-text text-transparent">
                {t.hero.title2}
              </span>
            </h1>

            <p
              className="animate-fade-up mt-3 block max-w-lg text-[11px] leading-snug text-slate-400 sm:mt-6 sm:text-[15px] sm:leading-relaxed"
              style={{ animationDelay: "220ms" }}
            >
              {t.hero.subtitle}
            </p>

          </div>

          <div
            className="login-bus animate-fade-up relative mt-3 min-h-[160px] flex-1 sm:mt-5 sm:min-h-[340px]"
            style={{ animationDelay: "360ms" }}
          >
            <BusScene />
          </div>
        </section>

        <section className="relative flex shrink-0 flex-col items-center justify-center px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 sm:px-8 sm:pb-6 lg:px-10 lg:py-8 xl:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_55%)]" />

          <div className="absolute inset-x-0 top-8 z-20 mx-auto hidden w-full max-w-[440px] justify-end lg:flex">
            <LanguageSwitcher glass />
          </div>

          <div className="relative w-full max-w-[440px]">
            <LoginForm />
          </div>
        </section>
      </div>

      <IntroCurtain />
    </main>
  );
}
