"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useHydrated, useUser } from "@/lib/store";

export function LandingNav() {
  const user = useUser();
  const hydrated = useHydrated();

  return (
    <header className="l-nav reveal">
      <Logo />
      <nav className="l-nav__links" aria-label="Navigasi utama">
        <a href="#cara-kerja">Cara Kerja</a>
        <a href="#contoh">Contoh</a>
        <a href="#fitur">Fitur</a>
        <a href="#faq">FAQ</a>
      </nav>
      <div className="l-nav__right">
        {hydrated && user ? (
          <Link href="/prd-saya" className="btn btn-outline btn-sm" id="landing-prd-saya">
            PRD Saya
          </Link>
        ) : (
          <Link href="/masuk" className="btn btn-ghost btn-sm" id="landing-login">
            Masuk
          </Link>
        )}
      </div>
    </header>
  );
}
