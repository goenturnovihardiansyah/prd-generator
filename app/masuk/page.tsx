"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ArrowLeft, CircleAlert, Clock, FileDown, ShieldCheck } from "lucide-react";
import { Aurora } from "@/components/Aurora";
import { signInWithGoogle, useHydrated, useUser } from "@/lib/store";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/prd-saya";
  const cancelled = params.get("error") === "dibatalkan";
  const user = useUser();
  const hydrated = useHydrated();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hydrated && user && !loading) router.replace(next);
  }, [hydrated, user, loading, next, router]);

  const login = () => {
    setLoading(true);
    // Mock OAuth redirect — nanti: supabase.auth.signInWithOAuth({ provider: "google" })
    setTimeout(() => {
      signInWithGoogle();
      router.replace(next);
    }, 1200);
  };

  return (
    <div className="auth">
      <Aurora />
      <Link href="/" className="btn btn-ghost btn-sm auth__back" id="login-back">
        <ArrowLeft aria-hidden="true" /> Beranda
      </Link>

      <main id="main" className="auth__card">
        <div className="logo-mark" aria-hidden="true" />
        <h1>Masuk untuk mulai membuat PRD</h1>
        <p>Satu klik dengan akun Google. Tanpa password baru.</p>

        {cancelled && (
          <div className="alert alert-danger" role="alert" style={{ marginTop: 22 }}>
            <CircleAlert aria-hidden="true" />
            <span>Login dibatalkan. Coba lagi untuk mulai membuat PRD.</span>
          </div>
        )}

        <button type="button" className="btn btn-google" onClick={login} disabled={loading} id="login-google">
          {loading ? (
            <>
              <span className="spinner" aria-hidden="true" /> Menghubungkan ke Google…
            </>
          ) : (
            <>
              <GoogleIcon /> Masuk dengan Google
            </>
          )}
        </button>

        <ul className="auth__benefits">
          <li>
            <ShieldCheck aria-hidden="true" /> PRD-mu hanya bisa dilihat olehmu sendiri
          </li>
          <li>
            <Clock aria-hidden="true" /> Jawaban tersimpan otomatis, lanjutkan kapan saja
          </li>
          <li>
            <FileDown aria-hidden="true" /> Salin atau unduh PRD dalam format Markdown
          </li>
        </ul>

        <p className="auth__legal">
          Dengan masuk, kamu menyetujui <Link href="/kebijakan-privasi">Kebijakan Privasi</Link> kami.
          {!cancelled && (
            <>
              {" "}
              ·{" "}
              <Link href={`/masuk?error=dibatalkan&next=${encodeURIComponent(next)}`} id="login-demo-cancel">
                Demo: login dibatalkan
              </Link>
            </>
          )}
        </p>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
