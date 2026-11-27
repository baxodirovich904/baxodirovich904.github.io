import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/provider";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bus Management — Transport boshqaruv tizimi",
    template: "%s — Bus Management",
  },
  description:
    "Avtobus parkini boshqarish, qatnovlar, haydovchilar, yo'nalishlar va kunlik tushum hisobotlari uchun zamonaviy platforma.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uz" className={`${manrope.variable} h-full`}>
      <body className="min-h-full bg-night-950 font-sans text-slate-200 antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
