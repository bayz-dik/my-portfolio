import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const display = Manrope({ variable: "--display", subsets: ["latin"], weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  title: "Bayu Andika | Portofolio Karier",
  description: "Portofolio karier Bayu Andika, Spesialis Dukungan IT & Operasional.",
  other: { "codex-preview": "development" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id" data-theme="light" suppressHydrationWarning><body className={display.variable}>{children}</body></html>;
}
