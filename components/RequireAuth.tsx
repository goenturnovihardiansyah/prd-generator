"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useHydrated, useUser } from "@/lib/store";

/** Mengarahkan ke /masuk bila belum login (mock untuk Supabase Auth). */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();
  const user = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (hydrated && !user) router.replace(`/masuk?next=${encodeURIComponent(pathname)}`);
  }, [hydrated, user, router, pathname]);

  if (!hydrated || !user) {
    return (
      <div style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <div className="spinner" aria-label="Memuat" />
      </div>
    );
  }
  return <>{children}</>;
}
