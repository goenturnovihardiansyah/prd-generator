"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FileText, Plus, Trash2, TriangleAlert } from "lucide-react";
import { AppNav } from "@/components/AppNav";
import { Aurora } from "@/components/Aurora";
import { Dialog } from "@/components/Dialog";
import { RequireAuth } from "@/components/RequireAuth";
import { useToast } from "@/components/Toast";
import { deletePrd, usePrds } from "@/lib/store";
import type { Prd } from "@/lib/types";
import { TOTAL_STEPS } from "@/lib/wizard-questions";

type Filter = "semua" | "draft" | "generated";

function relTime(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

function PrdCard({ prd, index, onDelete }: { prd: Prd; index: number; onDelete: () => void }) {
  const href = prd.status === "draft" ? `/wizard/${prd.id}` : `/prd/${prd.id}`;
  return (
    <article className="card prd-card" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="prd-card__top">
        <div className="prd-card__icon">
          <FileText aria-hidden="true" />
        </div>
        <span className={`pill pill-dot ${prd.status === "draft" ? "pill-draft" : "pill-generated"}`}>
          {prd.status === "draft" ? "Draft" : "Selesai"}
        </span>
      </div>
      <h2>
        <Link href={href} id={`prd-open-${prd.id}`}>
          {prd.judul}
        </Link>
      </h2>
      <p className="prd-card__info">Diubah {relTime(prd.updated_at)}</p>

      <div className="prd-card__bottom">
        {prd.status === "draft" ? (
          <div className="prd-card__progress">
            Langkah {prd.current_step} dari {TOTAL_STEPS}
            <div>
              <span style={{ width: `${(prd.current_step / TOTAL_STEPS) * 100}%` }} />
            </div>
          </div>
        ) : (
          <div className="prd-card__progress" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <TriangleAlert size={14} aria-hidden="true" style={{ color: "var(--assume)" }} />
            {prd.assumption_count} asumsi · {prd.high_impact_assumption_count} berdampak tinggi
          </div>
        )}
        <button
          type="button"
          className="icon-btn"
          aria-label={`Hapus ${prd.judul}`}
          onClick={onDelete}
          id={`prd-delete-${prd.id}`}
        >
          <Trash2 aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

function History() {
  const prds = usePrds();
  const toast = useToast();
  const [filter, setFilter] = useState<Filter>("semua");
  const [toDelete, setToDelete] = useState<Prd | null>(null);

  const sorted = useMemo(
    () => [...prds].sort((a, b) => b.updated_at.localeCompare(a.updated_at)),
    [prds],
  );
  const list = filter === "semua" ? sorted : sorted.filter((p) => p.status === filter);
  const count = (f: Filter) => (f === "semua" ? prds.length : prds.filter((p) => p.status === f).length);

  return (
    <main id="main" className="container">
      <div className="page-head">
        <div>
          <h1>PRD Saya</h1>
          <p>Lanjutkan draft atau buka PRD yang sudah jadi.</p>
        </div>
        <Link href="/wizard/baru" className="btn btn-primary" id="history-new">
          <Plus aria-hidden="true" /> Buat PRD baru
        </Link>
      </div>

      {prds.length === 0 ? (
        <div className="empty">
          <div className="empty__art" aria-hidden="true">
            <span />
            <span />
          </div>
          <h2>Belum ada PRD</h2>
          <p>Ceritakan idemu, jawab beberapa pertanyaan, dan dapatkan PRD pertamamu dalam sekitar 20 menit.</p>
          <Link href="/wizard/baru" className="btn btn-light btn-lg" id="history-empty-new">
            <Plus aria-hidden="true" /> Buat PRD pertamamu
          </Link>
        </div>
      ) : (
        <>
          <div className="tabs" role="tablist" aria-label="Filter status">
            {(
              [
                ["semua", "Semua"],
                ["draft", "Draft"],
                ["generated", "Selesai"],
              ] as const
            ).map(([f, label]) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                id={`history-tab-${f}`}
              >
                {label}
                <span>{count(f)}</span>
              </button>
            ))}
          </div>
          <div className="prd-grid">
            {list.map((p, i) => (
              <PrdCard key={p.id} prd={p} index={i} onDelete={() => setToDelete(p)} />
            ))}
          </div>
        </>
      )}

      <Dialog
        open={!!toDelete}
        title="Hapus PRD ini?"
        description={
          <>
            <strong>{toDelete?.judul}</strong> akan dihapus permanen dan tidak bisa dikembalikan.
          </>
        }
        confirmLabel="Hapus permanen"
        danger
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) {
            deletePrd(toDelete.id);
            toast("PRD dihapus");
          }
          setToDelete(null);
        }}
      />
    </main>
  );
}

export default function HistoryPage() {
  return (
    <div className="app-shell">
      <Aurora subtle />
      <div className="app-main">
        <AppNav />
        <RequireAuth>
          <History />
        </RequireAuth>
      </div>
    </div>
  );
}
