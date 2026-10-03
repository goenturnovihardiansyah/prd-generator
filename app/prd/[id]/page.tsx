"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Copy,
  Download,
  Lightbulb,
  PencilLine,
  RefreshCw,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { AppNav } from "@/components/AppNav";
import { Aurora } from "@/components/Aurora";
import { Dialog } from "@/components/Dialog";
import { Markdown } from "@/components/Markdown";
import { RequireAuth } from "@/components/RequireAuth";
import { useToast } from "@/components/Toast";
import { extractToc, slugify } from "@/lib/mock-ai";
import { updatePrd, usePrd } from "@/lib/store";
import type { Prd } from "@/lib/types";
import { WIZARD_STEPS } from "@/lib/wizard-questions";

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

function useActiveHeading(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-90px 0px -65% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

function Result({ prd }: { prd: Prd }) {
  const router = useRouter();
  const toast = useToast();
  const md = prd.content_md ?? "";
  const toc = useMemo(() => extractToc(md), [md]);
  const tocIds = useMemo(() => toc.map((t) => t.id), [toc]);
  const active = useActiveHeading(tocIds);
  const [editOpen, setEditOpen] = useState(false);
  const [fallbackOpen, setFallbackOpen] = useState(false);
  const [feedback, setFeedback] = useState(prd.feedback ?? "");
  const [feedbackSent, setFeedbackSent] = useState(!!prd.feedback);
  const fallbackRef = useRef<HTMLTextAreaElement>(null);
  const editRef = useRef<HTMLDivElement>(null);
  const asumsiId = toc.find((t) => t.text.includes("Asumsi"))?.id ?? slugify("11. Asumsi dan Risiko");

  useEffect(() => {
    if (!editOpen) return;
    const close = (e: MouseEvent) => !editRef.current?.contains(e.target as Node) && setEditOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [editOpen]);

  useEffect(() => {
    if (fallbackOpen) setTimeout(() => fallbackRef.current?.select(), 50);
  }, [fallbackOpen]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(md);
      toast("PRD disalin");
    } catch {
      setFallbackOpen(true); // clipboard diblokir browser
    }
  };

  const download = () => {
    const name = slugify(prd.judul) || "produk";
    const url = URL.createObjectURL(new Blob([md], { type: "text/markdown;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `prd-${name}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast(`prd-${name}.md diunduh`);
  };

  const rate = (r: "up" | "down") => {
    const next = prd.rating === r ? null : r;
    updatePrd(prd.id, { rating: next });
    if (next === "up") toast("Terima kasih atas penilaianmu!");
  };

  return (
    <>
      <section className="container res-head">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/prd-saya">PRD Saya</Link>
          <ChevronRight aria-hidden="true" />
          <span aria-current="page">{prd.judul}</span>
        </nav>

        <div className="res-head__row">
          <div>
            <h1>{prd.judul}</h1>
            <div className="res-head__meta">
              <span className="pill pill-generated pill-dot">Selesai</span>
              <span>Diperbarui {fmt(prd.updated_at)}</span>
            </div>
          </div>
          <div className="res-actions">
            <div className="edit-menu" ref={editRef}>
              <button
                type="button"
                className="btn btn-outline"
                aria-expanded={editOpen}
                aria-haspopup="menu"
                onClick={() => setEditOpen((o) => !o)}
                id="res-edit"
              >
                <PencilLine aria-hidden="true" /> Edit jawaban <ChevronDown aria-hidden="true" />
              </button>
              {editOpen && (
                <div className="menu" role="menu">
                  {WIZARD_STEPS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      role="menuitem"
                      className="menu__item"
                      onClick={() => router.push(`/wizard/${prd.id}?langkah=${s.id}`)}
                    >
                      <span className="q-card__num" style={{ margin: 0 }}>
                        {s.id}
                      </span>
                      {s.short}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="button" className="btn btn-outline" onClick={download} id="res-download">
              <Download aria-hidden="true" /> Unduh .md
            </button>
            <button type="button" className="btn btn-light" onClick={copy} id="res-copy">
              <Copy aria-hidden="true" /> Salin PRD
            </button>
          </div>
        </div>

        {prd.answers_changed_after_generate && (
          <div className="alert alert-warn" style={{ marginTop: 22 }}>
            <RefreshCw aria-hidden="true" />
            <div className="alert__body" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <span>
                <strong>Jawaban berubah</strong> — buat ulang PRD untuk memperbarui.
              </span>
              <Link href={`/prd/${prd.id}/generate`} className="btn btn-light btn-sm" id="res-regenerate">
                <RefreshCw aria-hidden="true" /> Buat ulang PRD
              </Link>
            </div>
          </div>
        )}

        <p className="res-tip">
          <Lightbulb aria-hidden="true" />
          <span>
            Tempel PRD ini ke AI agent-mu, lalu minta: <em>“Bangun Tahap 1 sesuai PRD ini.”</em>
          </span>
        </p>
      </section>

      <div className="container res-layout">
        <aside className="toc" aria-label="Daftar isi">
          <p className="toc__label">Daftar isi</p>
          <ol>
            {toc.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} aria-current={active === t.id ? "true" : undefined}>
                  {t.text}
                </a>
              </li>
            ))}
          </ol>
        </aside>

        <main id="main" style={{ minWidth: 0 }}>
          <article className="card doc">
            {prd.assumption_count > 0 ? (
              <div className="assume-card">
                <div className="assume-card__icon">
                  <TriangleAlert aria-hidden="true" />
                </div>
                <div>
                  <strong>
                    PRD ini memiliki {prd.assumption_count} asumsi, {prd.high_impact_assumption_count} berdampak tinggi
                  </strong>
                  <span>
                    Bagian bertanda <span className="assume-tag">ASUMSI</span> ditebak AI.{" "}
                    <a href={`#${asumsiId}`}>Lihat Bagian 11 →</a>
                  </span>
                </div>
              </div>
            ) : (
              <div className="assume-card assume-card--ok">
                <div className="assume-card__icon">
                  <ShieldCheck aria-hidden="true" />
                </div>
                <div>
                  <strong>Tidak ada asumsi — semua bagian berdasarkan jawabanmu</strong>
                </div>
              </div>
            )}

            <Markdown content={md} />

            <section className="rating" aria-labelledby="rating-title">
              <div className="rating__row">
                <div>
                  <h2 id="rating-title">Apakah PRD ini membantu?</h2>
                  <p>Penilaianmu membantu kami memperbaiki hasil PRD.</p>
                </div>
                <div className="rating__btns">
                  <button
                    type="button"
                    className="rate-btn"
                    aria-pressed={prd.rating === "up"}
                    aria-label="Membantu"
                    onClick={() => rate("up")}
                    id="rate-up"
                  >
                    👍
                  </button>
                  <button
                    type="button"
                    className="rate-btn"
                    aria-pressed={prd.rating === "down"}
                    aria-label="Kurang membantu"
                    onClick={() => rate("down")}
                    id="rate-down"
                  >
                    👎
                  </button>
                </div>
              </div>
              {prd.rating === "down" &&
                (feedbackSent ? (
                  <p className="rating__thanks">
                    <CircleCheck aria-hidden="true" /> Terima kasih, masukanmu sudah kami terima.
                  </p>
                ) : (
                  <div className="rating__feedback">
                    <label htmlFor="feedback">Apa yang kurang? (opsional)</label>
                    <textarea
                      id="feedback"
                      className="field"
                      rows={3}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Misalnya: bagian fitur terlalu umum, tahapan kurang detail…"
                    />
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                      <button
                        type="button"
                        className="btn btn-light btn-sm"
                        id="feedback-send"
                        onClick={() => {
                          updatePrd(prd.id, { feedback: feedback.trim() || null });
                          setFeedbackSent(true);
                        }}
                      >
                        Kirim masukan
                      </button>
                    </div>
                  </div>
                ))}
            </section>
          </article>
        </main>
      </div>

      <Dialog
        open={fallbackOpen}
        title="Salin PRD secara manual"
        description="Browser tidak mengizinkan akses clipboard. Teks di bawah sudah terseleksi — tekan Ctrl+C untuk menyalin."
        confirmLabel="Selesai"
        cancelLabel="Tutup"
        onConfirm={() => setFallbackOpen(false)}
        onCancel={() => setFallbackOpen(false)}
      >
        <textarea ref={fallbackRef} className="field copy-fallback" readOnly value={md} aria-label="Isi PRD" />
      </Dialog>
    </>
  );
}

function ResultLoader() {
  const { id } = useParams<{ id: string }>();
  const prd = usePrd(id);
  const router = useRouter();

  useEffect(() => {
    if (prd && prd.status === "draft") router.replace(`/wizard/${prd.id}`);
  }, [prd, router]);

  if (!prd) {
    return (
      <div className="empty">
        <h2>PRD tidak ditemukan</h2>
        <p>Mungkin sudah dihapus, atau tautannya salah.</p>
        <Link href="/prd-saya" className="btn btn-light">
          Ke PRD Saya
        </Link>
      </div>
    );
  }
  if (prd.status === "draft") return null;
  return <Result prd={prd} />;
}

export default function ResultPage() {
  return (
    <div className="app-shell">
      <Aurora subtle />
      <div className="app-main">
        <AppNav />
        <RequireAuth>
          <ResultLoader />
        </RequireAuth>
      </div>
    </div>
  );
}
