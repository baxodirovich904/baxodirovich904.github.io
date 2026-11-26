"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dictionaries, type Dictionary, type Locale } from "./dictionaries";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
  formatNumber: (value: number, decimals?: number) => string;
  formatDate: (date: Date) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "bm-locale";

const intlLocales: Record<Locale, string> = {
  uz: "uz-UZ",
  ru: "ru-RU",
  en: "en-US",
  kaa: "kaa-KZ",
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("uz");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
        if (saved && saved in dictionaries) {
          setLocaleState(saved);
        }
      } catch {
        // Storage can be unavailable in private mode; fall back to default.
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.documentElement.lang = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage errors.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LanguageContextValue>(() => {
    const dictionary = dictionaries[locale];

    const formatNumber = (input: number, decimals = 0) =>
      new Intl.NumberFormat(intlLocales[locale], {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(input);

    const formatDate = (date: Date) => {
      const day = date.getDate();
      const month = dictionary.common.months[date.getMonth()];
      const year = date.getFullYear();

      if (locale === "ru") {
        return `${day} ${month} ${year}`;
      }

      return `${day}-${month}, ${year}`;
    };

    return {
      locale,
      setLocale,
      t: dictionary,
      formatNumber,
      formatDate,
    };
  }, [locale, setLocale]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
