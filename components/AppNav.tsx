"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FileText, LogOut, Plus, Shield } from "lucide-react";
import { Logo } from "./Logo";
import { signOut, useUser } from "@/lib/store";

export function AppNav({ children }: { children?: React.ReactNode }) {
  const user = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="app-nav">
      <div className="container app-nav__inner">
        <Logo href={user ? "/prd-saya" : "/"} />
        {children ?? (
          <nav className="app-nav__links" aria-label="Navigasi aplikasi">
            <Link
              href="/prd-saya"
              className="app-nav__link"
              aria-current={pathname === "/prd-saya" ? "page" : undefined}
              id="nav-prd-saya"
            >
              PRD Saya
            </Link>
            <Link href="/wizard/baru" className="btn btn-light btn-sm" id="nav-buat-prd">
              <Plus aria-hidden="true" /> Buat PRD
            </Link>
          </nav>
        )}
        {user && (
          <div style={{ position: "relative" }} ref={menuRef}>
            <button
              type="button"
              className="avatar"
              aria-label="Menu akun"
              aria-expanded={open}
              aria-haspopup="menu"
              onClick={() => setOpen((o) => !o)}
              id="nav-avatar"
            >
              {user.nama.charAt(0)}
            </button>
            {open && (
              <div className="menu" role="menu">
                <div className="menu__head">
                  <strong>{user.nama}</strong>
                  <span>{user.email}</span>
                </div>
                <Link href="/prd-saya" className="menu__item" role="menuitem" onClick={() => setOpen(false)}>
                  <FileText aria-hidden="true" /> PRD Saya
                </Link>
                <Link href="/kebijakan-privasi" className="menu__item" role="menuitem" onClick={() => setOpen(false)}>
                  <Shield aria-hidden="true" /> Kebijakan Privasi
                </Link>
                <button
                  type="button"
                  className="menu__item"
                  role="menuitem"
                  id="nav-logout"
                  onClick={() => {
                    signOut();
                    router.push("/");
                  }}
                >
                  <LogOut aria-hidden="true" /> Keluar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
