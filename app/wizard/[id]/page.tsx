"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, FileText, RefreshCw, Sparkles, X } from "lucide-react";
import { Aurora } from "@/components/Aurora";
import { DemoPanel } from "@/components/DemoPanel";
import { Dialog } from "@/components/Dialog";
import { Logo } from "@/components/Logo";
import { RequireAuth } from "@/components/RequireAuth";
import { AiDraftCard } from "@/components/wizard/AiDraftCard";
import { QuestionCard } from "@/components/wizard/QuestionCard";
import { updatePrd, usePrd } from "@/lib/store";
import type { Prd, WizardAnswers } from "@/lib/types";
import { ALL_QUESTIONS, TOTAL_STEPS, WIZARD_STEPS, type Question } from "@/lib/wizard-questions";

const isAnswered = (a: WizardAnswers, q: Question) => !!a[q.id] && (a[q.id].dilewati || !!a[q.id].jawaban.trim());
const isMissingRequired = (a: WizardAnswers, q: Question) => !!q.required && !a[q.id]?.jawaban?.trim();

function Wizard({ prd }: { prd: Prd }) {
  const router = useRouter();
  const params = useSearchParams();
  const initial = Number(params.get("langkah")) || prd.current_step || 1;
  const [step, setStep] = useState(Math.min(Math.max(initial, 1), TOTAL_STEPS));
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [missingOpen, setMissingOpen] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mainRef = useRef<HTMLElement>(null);

  const answers = prd.wizard_answers;
  const isRevisi = prd.status === "generated";
  const current = WIZARD_STEPS[step - 1];
  const furthest = isRevisi ? TOTAL_STEPS : Math.max(prd.current_step, step);
  const progress = Math.round(
    (ALL_QUESTIONS.filter((q) => isAnswered(answers, q)).length / ALL_QUESTIONS.length) * 100,
  );

  /* Simpan otomatis setiap perubahan (mock untuk PATCH prds) */
  const save = useCallback(
    (next: WizardAnswers) => {
      setSaving(true);
      updatePrd(prd.id, {
        wizard_answers: next,
        judul: next["1.1"]?.jawaban?.trim() || "PRD tanpa judul",
        ...(isRevisi ? { answers_changed_after_generate: true } : {}),
      });
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => setSaving(false), 700);
    },
    [prd.id, isRevisi],
  );

  const setAnswer = (id: string, jawaban: string) => {
    save({ ...answers, [id]: { jawaban, dilewati: false } });
    if (errors.has(id) && jawaban.trim()) {
      const e = new Set(errors);
      e.delete(id);
      setErrors(e);
    }
  };
  const skip = (id: string) => save({ ...answers, [id]: { jawaban: "", dilewati: true } });
  const unskip = (id: string) => save({ ...answers, [id]: { jawaban: "", dilewati: false } });

  const goTo = (n: number) => {
    setErrors(new Set());
    setStep(n);
    if (!isRevisi) updatePrd(prd.id, { current_step: Math.max(n, prd.current_step) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true });
  }, [step]);

  const validateStep = () => {
    const missing = current.questions.filter((q) => isMissingRequired(answers, q)).map((q) => q.id);
    setErrors(new Set(missing));
    if (missing.length) {
      document.getElementById(`card-${missing[0]}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    goTo(step + 1);
  };

  const allMissing = ALL_QUESTIONS.filter((q) => isMissingRequired(answers, q));

  const generate = () => {
    if (!validateStep()) return;
    if (allMissing.length) return setMissingOpen(true);
    router.push(`/prd/${prd.id}/generate`);
  };

  return (
    <>
      <header className="wz-top">
        <div className="container wz-top__inner">
          <Logo href="/prd-saya" />
          <div className="wz-top__title">
            <strong>{prd.judul}</strong>
            <span className="save-state" data-saving={saving} aria-live="polite">
              <i aria-hidden="true" />
              {saving ? "Menyimpan…" : "Tersimpan otomatis"}
            </span>
          </div>
          <Link
            href={isRevisi ? `/prd/${prd.id}` : "/prd-saya"}
            className="btn btn-ghost btn-sm"
            id="wizard-exit"
          >
            <X aria-hidden="true" /> {isRevisi ? "Kembali ke hasil" : "Simpan & keluar"}
          </Link>
        </div>
        <div
          className="wz-progress"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progres wizard"
        >
          <span style={{ width: `${Math.max(progress, (step / TOTAL_STEPS) * 100 * 0.15)}%` }} />
        </div>
      </header>

      <div className="container wz-layout">
        <aside className="wz-steps" aria-label="Langkah wizard">
          <p className="wz-steps__label">Langkah</p>
          <ol>
            {WIZARD_STEPS.map((s) => {
              const state =
                s.id === step
                  ? "current"
                  : s.id <= furthest && s.questions.some((q) => isAnswered(answers, q))
                    ? "done"
                    : "todo";
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    className="wz-step"
                    data-state={state}
                    disabled={s.id > furthest}
                    onClick={() => goTo(s.id)}
                    aria-current={s.id === step ? "step" : undefined}
                    id={`wizard-step-${s.id}`}
                  >
                    <span className="wz-step__dot">{state === "done" ? <Check aria-hidden="true" /> : s.id}</span>
                    <span className="wz-step__text">{s.short}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="wz-steps__help">
            <strong>Belum tahu jawabannya?</strong>
            Tidak apa-apa. Lewati saja — AI akan menebak dan menandainya sebagai{" "}
            <span className="assume-tag">ASUMSI</span> supaya kamu tahu bagian mana yang perlu dicek.
          </div>
        </aside>

        <main id="main" className="wz-main" ref={mainRef} tabIndex={-1} style={{ outline: "none" }}>
          {isRevisi && (
            <div className="alert alert-info revisi-banner">
              <RefreshCw aria-hidden="true" />
              <div className="alert__body">
                <strong>Mode revisi.</strong> Ubah jawaban di langkah mana pun, lalu klik “Buat ulang PRD”. PRD lama
                tetap ada sampai kamu membuat ulang.
              </div>
            </div>
          )}

          <div className="wz-head" key={`head-${step}`}>
            <p className="wz-head__step">
              Langkah {step} dari {TOTAL_STEPS}
            </p>
            <h1>{current.title}</h1>
            <p>{current.description}</p>
            <div className="wz-head__feeds">
              <FileText size={14} aria-hidden="true" /> Mengisi:
              {current.prdSections.map((s) => (
                <span key={s} className="pill">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="q-list" key={`q-${step}`}>
            {current.questions.map((q, i) => {
              const common = {
                question: q,
                answer: answers[q.id],
                error: errors.has(q.id),
                delay: 60 + i * 60,
                onChange: (v: string) => setAnswer(q.id, v),
                onSkip: () => skip(q.id),
                onUnskip: () => unskip(q.id),
              };
              return q.type === "ai-draft" ? (
                <AiDraftCard key={q.id} {...common} answers={answers} />
              ) : (
                <QuestionCard key={q.id} {...common} />
              );
            })}
          </div>

          <nav className="wz-nav" aria-label="Navigasi langkah">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => goTo(step - 1)}
              disabled={step === 1}
              id="wizard-back"
            >
              <ArrowLeft aria-hidden="true" /> <span>Kembali</span>
            </button>
            <div className="wz-nav__right">
              {isRevisi && step < TOTAL_STEPS && (
                <button type="button" className="btn btn-outline" onClick={generate} id="wizard-regenerate">
                  <RefreshCw aria-hidden="true" /> Buat ulang PRD
                </button>
              )}
              {step < TOTAL_STEPS ? (
                <button type="button" className="btn btn-light" onClick={next} id="wizard-next">
                  Lanjut <ArrowRight aria-hidden="true" />
                </button>
              ) : (
                <button type="button" className="btn btn-generate btn-lg" onClick={generate} id="wizard-generate">
                  <Sparkles aria-hidden="true" /> {isRevisi ? "Buat ulang PRD" : "Buat PRD"}
                </button>
              )}
            </div>
          </nav>
        </main>
      </div>

      <Dialog
        open={missingOpen}
        title="Masih ada pertanyaan wajib"
        description="Pertanyaan bertanda ⭐ perlu dijawab supaya PRD bisa dibuat. Jawaban singkat juga boleh."
        confirmLabel="Oke, mengerti"
        cancelLabel="Tutup"
        onConfirm={() => setMissingOpen(false)}
        onCancel={() => setMissingOpen(false)}
      >
        <ul className="missing-list">
          {allMissing.map((q) => {
            const s = WIZARD_STEPS.find((st) => st.questions.includes(q))!;
            return (
              <li key={q.id}>
                <button
                  type="button"
                  onClick={() => {
                    setMissingOpen(false);
                    goTo(s.id);
                    setTimeout(() => setErrors(new Set([q.id])), 50);
                  }}
                >
                  <code>{q.id}</code> {q.label}
                </button>
              </li>
            );
          })}
        </ul>
      </Dialog>

      <DemoPanel />
    </>
  );
}

function WizardLoader() {
  const { id } = useParams<{ id: string }>();
  const prd = usePrd(id);

  if (!prd) {
    return (
      <div className="empty" style={{ minHeight: "80dvh" }}>
        <h2>PRD tidak ditemukan</h2>
        <p>Mungkin sudah dihapus, atau tautannya salah.</p>
        <Link href="/prd-saya" className="btn btn-light">
          Ke PRD Saya
        </Link>
      </div>
    );
  }
  return <Wizard prd={prd} />;
}

export default function WizardPage() {
  return (
    <div className="app-shell">
      <Aurora subtle />
      <div className="app-main">
        <RequireAuth>
          <Suspense>
            <WizardLoader />
          </Suspense>
        </RequireAuth>
      </div>
    </div>
  );
}
