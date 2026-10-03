"use client";

import { Check, CircleAlert, Lightbulb } from "lucide-react";
import type { Question } from "@/lib/wizard-questions";
import type { WizardAnswer } from "@/lib/types";

export interface QuestionProps {
  question: Question;
  answer?: WizardAnswer;
  error?: boolean;
  delay?: number;
  onChange: (jawaban: string) => void;
  onSkip: () => void;
  onUnskip: () => void;
}

export const REQUIRED_MSG = "Pertanyaan ini perlu dijawab supaya PRD bisa dibuat. Jawaban singkat juga boleh.";

export function QuestionHeader({ question }: { question: Question }) {
  return (
    <>
      <div className="q-card__head">
        <span className="q-card__num">{question.id}</span>
        <label className="q-card__label" htmlFor={`q-${question.id}`} id={`q-${question.id}-label`}>
          {question.label}
          {question.required && (
            <span className="q-card__req" title="Wajib dijawab" aria-label="wajib">
              ⭐
            </span>
          )}
        </label>
      </div>
      {question.help && <p className="q-card__help">{question.help}</p>}
    </>
  );
}

export function SkippedNote({ onUnskip }: { onUnskip: () => void }) {
  return (
    <div className="skipped-note">
      <span>Dilewati — AI akan menebak bagian ini dan menandainya (ASUMSI).</span>
      <button type="button" onClick={onUnskip}>
        Jawab sekarang
      </button>
    </div>
  );
}

function ChoiceInput({ question, value, onChange }: { question: Question; value: string; onChange: (v: string) => void }) {
  const multi = question.type === "multi";
  const selected = multi ? value.split(",").map((s) => s.trim()).filter(Boolean) : [value];

  const toggle = (opt: string) => {
    if (!multi) return onChange(value === opt ? "" : opt);
    const next = selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt];
    // jaga urutan sesuai opsi
    onChange((question.options ?? []).filter((o) => next.includes(o)).join(", "));
  };

  return (
    <div className="options" role={multi ? "group" : "radiogroup"} aria-labelledby={`q-${question.id}-label`}>
      {question.options?.map((opt) => (
        <button
          key={opt}
          type="button"
          role={multi ? "checkbox" : "radio"}
          aria-checked={selected.includes(opt)}
          className="option"
          onClick={() => toggle(opt)}
          id={`q-${question.id}-${opt.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
        >
          <span className="option__mark" aria-hidden="true">
            <Check strokeWidth={3} />
          </span>
          {opt}
        </button>
      ))}
    </div>
  );
}

export function QuestionCard({ question, answer, error, delay = 0, onChange, onSkip, onUnskip }: QuestionProps) {
  const value = answer?.jawaban ?? "";
  const skipped = !!answer?.dilewati;
  const isChoice = question.type === "choice" || question.type === "multi";

  return (
    <div
      className="q-card"
      data-error={error || undefined}
      data-skipped={skipped || undefined}
      style={{ animationDelay: `${delay}ms` }}
      id={`card-${question.id}`}
    >
      <QuestionHeader question={question} />

      <div className="q-card__body">
        {skipped ? (
          <SkippedNote onUnskip={onUnskip} />
        ) : isChoice ? (
          <ChoiceInput question={question} value={value} onChange={onChange} />
        ) : question.type === "text" ? (
          <input
            id={`q-${question.id}`}
            className="field"
            value={value}
            placeholder={question.placeholder ?? "Tulis jawabanmu…"}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={error || undefined}
            aria-describedby={error ? `q-${question.id}-err` : undefined}
            autoComplete="off"
          />
        ) : (
          <textarea
            id={`q-${question.id}`}
            className="field"
            value={value}
            rows={4}
            placeholder={question.placeholder ?? "Tulis jawabanmu…"}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={error || undefined}
            aria-describedby={error ? `q-${question.id}-err` : undefined}
          />
        )}

        {!skipped && !isChoice && (
          <div className="q-example">
            <span className="q-example__text">
              <b>
                <Lightbulb size={13} style={{ display: "inline", verticalAlign: "-2px" }} aria-hidden="true" /> Contoh:
              </b>
              {question.example}
            </span>
            {!value && (
              <button type="button" onClick={() => onChange(question.example)} id={`q-${question.id}-use-example`}>
                Pakai contoh
              </button>
            )}
          </div>
        )}
      </div>

      {!skipped && (error || !question.required) && (
        <div className="q-card__foot">
          {error && (
            <p className="q-error" id={`q-${question.id}-err`} role="alert">
              <CircleAlert aria-hidden="true" />
              {REQUIRED_MSG}
            </p>
          )}
          {!question.required && (
            <button type="button" className="skip-btn" onClick={onSkip} id={`q-${question.id}-skip`}>
              Saya belum tahu
            </button>
          )}
        </div>
      )}
    </div>
  );
}
