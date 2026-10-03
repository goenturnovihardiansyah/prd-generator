"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CircleCheck, Clock, RefreshCw, Sparkles, TriangleAlert } from "lucide-react";
import { mockDraft } from "@/lib/mock-ai";
import { getDemo } from "@/lib/store";
import type { WizardAnswers } from "@/lib/types";
import { QuestionHeader, SkippedNote, type QuestionProps } from "./QuestionCard";

type Phase = "loading" | "ready" | "error" | "limit";

function timeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const mins = Math.round((midnight.getTime() - now.getTime()) / 60000);
  return `${Math.floor(mins / 60)} jam ${mins % 60} menit`;
}

/** US-03 — Draft jawaban dari AI (mock; nanti Route Handler → Gemini Flash). */
export function AiDraftCard({
  question,
  answer,
  answers,
  delay = 0,
  onChange,
  onSkip,
  onUnskip,
}: QuestionProps & { answers: WizardAnswers }) {
  const accepted = !!answer && !answer.dilewati && !!answer.jawaban.trim();
  const skipped = !!answer?.dilewati;
  const [phase, setPhase] = useState<Phase>(accepted ? "ready" : "loading");
  const [draft, setDraft] = useState("");
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const request = useCallback(() => {
    setPhase("loading");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const mode = getDemo().ai;
      if (mode === "sibuk") return setPhase("error");
      if (mode === "limit") return setPhase("limit");
      setDraft(mockDraft(question.id, answersRef.current));
      setPhase("ready");
    }, 1600);
  }, [question.id]);

  useEffect(() => {
    if (!accepted && !skipped) request();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // hanya saat kartu pertama kali tampil
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = accepted ? answer!.jawaban : draft;

  return (
    <div className="q-card q-card--ai" style={{ animationDelay: `${delay}ms` }} id={`card-${question.id}`}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <QuestionHeader question={question} />
        </div>
        <span className="ai-badge">
          <Sparkles aria-hidden="true" /> Draft AI
        </span>
      </div>

      <div className="q-card__body" aria-live="polite">
        {skipped ? (
          <SkippedNote
            onUnskip={() => {
              onUnskip();
              request();
            }}
          />
        ) : phase === "loading" ? (
          <div className="ai-loading">
            <div className="ai-loading__label">
              <span className="spinner" aria-hidden="true" /> AI sedang menyusun draft dari jawabanmu…
            </div>
            <div className="skeleton" style={{ height: 12, width: "92%" }} />
            <div className="skeleton" style={{ height: 12, width: "78%" }} />
            <div className="skeleton" style={{ height: 12, width: "85%" }} />
          </div>
        ) : phase === "error" ? (
          <div className="alert alert-warn" role="alert">
            <TriangleAlert aria-hidden="true" />
            <div className="alert__body">
              <strong>AI sedang sibuk.</strong> Draft belum berhasil dibuat.
              <div className="alert__actions">
                <button type="button" className="btn btn-light btn-sm" onClick={request} id={`ai-${question.id}-retry`}>
                  <RefreshCw aria-hidden="true" /> Coba lagi
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={onSkip} id={`ai-${question.id}-skip`}>
                  Lewati (AI akan menebak saat membuat PRD)
                </button>
              </div>
            </div>
          </div>
        ) : phase === "limit" ? (
          <div className="alert alert-info" role="alert">
            <Clock aria-hidden="true" />
            <div className="alert__body">
              <strong>Batas draft AI hari ini sudah tercapai.</strong> Batas di-reset pukul 00.00 (sekitar{" "}
              {timeUntilMidnight()} lagi). Jawaban wizard-mu tetap tersimpan.
              <div className="alert__actions">
                <button
                  type="button"
                  className="btn btn-light btn-sm"
                  onClick={() => {
                    setDraft("");
                    setPhase("ready");
                  }}
                >
                  Tulis sendiri
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={onSkip}>
                  Lewati
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <textarea
              id={`q-${question.id}`}
              className="field"
              rows={Math.max(4, value.split("\n").length + 1)}
              value={value}
              placeholder="Tulis jawabanmu…"
              onChange={(e) => onChange(e.target.value)}
            />
            <div className="ai-actions">
              {!accepted && draft && (
                <button
                  type="button"
                  className="btn btn-light btn-sm"
                  onClick={() => onChange(draft)}
                  id={`ai-${question.id}-accept`}
                >
                  <CircleCheck aria-hidden="true" /> Setuju
                </button>
              )}
              <button type="button" className="btn btn-ghost btn-sm" onClick={request} id={`ai-${question.id}-regen`}>
                <RefreshCw aria-hidden="true" /> Buat ulang draft
              </button>
              <button type="button" className="skip-btn" onClick={onSkip} style={{ marginLeft: 0 }}>
                Saya belum tahu
              </button>
              <span className="ai-status" data-ok={accepted || undefined}>
                {accepted ? (
                  <>
                    <CircleCheck aria-hidden="true" /> Tersimpan sebagai jawabanmu
                  </>
                ) : (
                  "Belum disetujui — edit langsung atau klik Setuju"
                )}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
