import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
import "./globals.css";
import "./landing.css";
import "./app.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-jb",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "PRD Generator — Ubah Ide Jadi PRD Siap Pakai untuk AI Agent",
    template: "%s · PRD Generator",
  },
  description:
    "Jawab pertanyaan sederhana dalam Bahasa Indonesia, dapatkan PRD lengkap yang langsung bisa ditempel ke Antigravity, Claude, atau Cursor. Asumsi AI ditandai jelas.",
};

export const viewport: Viewport = {
  themeColor: "#030306",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${jakarta.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Langsung ke konten utama
        </a>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
