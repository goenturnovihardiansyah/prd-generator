/** Tipe data mengikuti PRD §8 — nama kolom & enum dipakai persis. */

export type PrdStatus = "draft" | "generated";
export type PrdRating = "up" | "down" | null;

export interface WizardAnswer {
  jawaban: string;
  dilewati: boolean;
}

export type WizardAnswers = Record<string, WizardAnswer>;

export interface Prd {
  id: string;
  user_id: string;
  judul: string;
  status: PrdStatus;
  current_step: number;
  wizard_answers: WizardAnswers;
  content_md: string | null;
  assumption_count: number;
  high_impact_assumption_count: number;
  rating: PrdRating;
  feedback: string | null;
  created_at: string;
  updated_at: string;
  /** Hanya untuk UI (US-08): jawaban berubah setelah PRD dibuat. */
  answers_changed_after_generate?: boolean;
}

export interface Profile {
  id: string;
  email: string;
  nama: string;
  avatar_url: string | null;
  role: "user";
  created_at: string;
}
