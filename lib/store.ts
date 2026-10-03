"use client";

import { useSyncExternalStore } from "react";
import type { Prd, Profile, WizardAnswers } from "./types";
import { buildMockPrd, countAssumptions } from "./mock-ai";

/**
 * MOCK STORE (localStorage) — pengganti sementara Supabase.
 * API-nya sengaja dibuat mirip operasi tabel `profiles` & `prds`
 * supaya mudah diganti ke Supabase client di tahap backend.
 */

const KEYS = {
  user: "prdgen:user",
  prds: "prdgen:prds",
  demo: "prdgen:demo",
  seeded: "prdgen:seeded",
  pendingIdea: "prdgen:pending-idea",
} as const;

export interface DemoSettings {
  ai: "normal" | "sibuk" | "limit";
  generate: "normal" | "putus";
}

const DEFAULT_DEMO: DemoSettings = { ai: "normal", generate: "normal" };

/* ------------------------------------------------------------ pub/sub */

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = () => cb();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const cache = new Map<string, { raw: string | null; value: unknown }>();
function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value as T;
  let value: T = fallback;
  try {
    value = raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    value = fallback;
  }
  cache.set(key, { raw, value });
  return value;
}
function write(key: string, value: unknown) {
  if (value === null) localStorage.removeItem(key);
  else localStorage.setItem(key, JSON.stringify(value));
  emit();
}

/* ----------------------------------------------------------- auth mock */

export function getUser() {
  return read<Profile | null>(KEYS.user, null);
}

export function signInWithGoogle(): Profile {
  const profile: Profile = {
    id: "user-demo-1",
    email: "goentur@gmail.com",
    nama: "Goentur",
    avatar_url: null,
    role: "user",
    created_at: new Date().toISOString(),
  };
  write(KEYS.user, profile);
  if (!localStorage.getItem(KEYS.seeded)) {
    seedDemoPrds(profile.id);
    localStorage.setItem(KEYS.seeded, "1");
  }
  return profile;
}

export function signOut() {
  write(KEYS.user, null);
}

/* ---------------------------------------------------------- prds table */

const EMPTY: Prd[] = [];

export function listPrds(): Prd[] {
  return read<Prd[]>(KEYS.prds, EMPTY);
}

export function getPrd(id: string) {
  return listPrds().find((p) => p.id === id) ?? null;
}

export function createPrd(initial?: Partial<Prd>): Prd {
  const now = new Date().toISOString();
  const prd: Prd = {
    id: Math.random().toString(36).slice(2, 10),
    user_id: getUser()?.id ?? "anon",
    judul: "PRD tanpa judul",
    status: "draft",
    current_step: 1,
    wizard_answers: {},
    content_md: null,
    assumption_count: 0,
    high_impact_assumption_count: 0,
    rating: null,
    feedback: null,
    created_at: now,
    updated_at: now,
    ...initial,
  };
  write(KEYS.prds, [prd, ...listPrds()]);
  return prd;
}

export function updatePrd(id: string, patch: Partial<Prd>) {
  write(
    KEYS.prds,
    listPrds().map((p) => (p.id === id ? { ...p, ...patch, updated_at: new Date().toISOString() } : p)),
  );
}

export function deletePrd(id: string) {
  write(
    KEYS.prds,
    listPrds().filter((p) => p.id !== id),
  );
}

export function finalizePrd(id: string, content_md: string) {
  const { total, high } = countAssumptions(content_md);
  updatePrd(id, {
    content_md,
    status: "generated",
    assumption_count: total,
    high_impact_assumption_count: high,
    answers_changed_after_generate: false,
  });
}

/* ---------------------------------------------------------- pending idea */

export function setPendingIdea(idea: { text: string; type: string | null }) {
  sessionStorage.setItem(KEYS.pendingIdea, JSON.stringify(idea));
}
export function takePendingIdea(): { text: string; type: string | null } | null {
  const raw = sessionStorage.getItem(KEYS.pendingIdea);
  if (!raw) return null;
  sessionStorage.removeItem(KEYS.pendingIdea);
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/* ---------------------------------------------------------- demo toggles */

export function getDemo() {
  return read<DemoSettings>(KEYS.demo, DEFAULT_DEMO);
}
export function setDemo(patch: Partial<DemoSettings>) {
  write(KEYS.demo, { ...getDemo(), ...patch });
}

/* --------------------------------------------------------------- hooks */

export function useUser() {
  return useSyncExternalStore(subscribe, getUser, () => null);
}
export function usePrds() {
  return useSyncExternalStore(subscribe, listPrds, () => EMPTY);
}
export function usePrd(id: string) {
  const prds = usePrds();
  return prds.find((p) => p.id === id) ?? null;
}
export function useDemo() {
  return useSyncExternalStore(subscribe, getDemo, () => DEFAULT_DEMO);
}
/** true setelah hydrate di client — mencegah flicker "belum login". */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/* ---------------------------------------------------------------- seed */

function seedDemoPrds(userId: string) {
  const cmmsAnswers: WizardAnswers = {
    "1.1": { jawaban: "MesinKu", dilewati: false },
    "1.2": {
      jawaban:
        "Aplikasi untuk teknisi pabrik mencatat jadwal perawatan mesin dan melaporkan kerusakan langsung dari HP.",
      dilewati: false,
    },
    "1.3": { jawaban: "Web App", dilewati: false },
    "1.4": { jawaban: "Laptop / Desktop, HP", dilewati: false },
    "2.1": {
      jawaban: "Jadwal perawatan mesin sering terlewat karena masih dicatat di buku dan grup WhatsApp.",
      dilewati: false,
    },
    "2.2": { jawaban: "", dilewati: true },
    "3.1": { jawaban: "Teknisi lapangan, supervisor maintenance, manajer pabrik", dilewati: false },
    "4.1": {
      jawaban: "Jadwal perawatan otomatis\nChecklist harian\nLapor kerusakan dengan foto\nDashboard supervisor",
      dilewati: false,
    },
    "5.2": { jawaban: "1 bulan", dilewati: false },
    "8.1": { jawaban: "Next.js + Supabase", dilewati: false },
  };
  const md = buildMockPrd(cmmsAnswers);
  const { total, high } = countAssumptions(md);
  const now = Date.now();
  const prds: Prd[] = [
    {
      id: "demo-mesinku",
      user_id: userId,
      judul: "MesinKu",
      status: "generated",
      current_step: 8,
      wizard_answers: cmmsAnswers,
      content_md: md,
      assumption_count: total,
      high_impact_assumption_count: high,
      rating: null,
      feedback: null,
      created_at: new Date(now - 86400000 * 2).toISOString(),
      updated_at: new Date(now - 3600000 * 5).toISOString(),
    },
    {
      id: "demo-kasirku",
      user_id: userId,
      judul: "KasirKopi",
      status: "draft",
      current_step: 3,
      wizard_answers: {
        "1.1": { jawaban: "KasirKopi", dilewati: false },
        "1.2": { jawaban: "Aplikasi kasir sederhana untuk kedai kopi kecil.", dilewati: false },
        "1.3": { jawaban: "Mobile App", dilewati: false },
        "2.1": { jawaban: "Pemilik kedai susah melihat menu terlaris dan stok bahan.", dilewati: false },
      },
      content_md: null,
      assumption_count: 0,
      high_impact_assumption_count: 0,
      rating: null,
      feedback: null,
      created_at: new Date(now - 86400000).toISOString(),
      updated_at: new Date(now - 60000 * 40).toISOString(),
    },
  ];
  write(KEYS.prds, prds);
}
