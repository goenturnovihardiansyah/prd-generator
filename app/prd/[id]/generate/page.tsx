"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, RefreshCw, WifiOff } from "lucide-react";
import { AppNav } from "@/components/AppNav";
import { Aurora } from "@/components/Aurora";
import { DemoPanel } from "@/components/DemoPanel";
import { Markdown } from "@/components/Markdown";
import { RequireAuth } from "@/components/RequireAuth";
import { buildMockPrd, GENERATE_STAGES } from "@/lib/mock-ai";
import { finalizePrd, getDemo, getPrd } from "@/lib/store";

type Phase = "streaming" | "done" | "error";

/** US-04 — Generate PRD dengan streaming (mock; nanti stream dari Gemini Pro). */
function Generator({ id }: { id: string }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("streaming");
  const [shown, setShown] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const fullRef = useRef("");
  const docRef = useRef<HTMLDivElement>(null);
  const runId = useRef(0);

  const start = useCallback(() => {
    const prd = getPrd(id);
    if (!prd) return;
    const full = buildMockPrd(prd.wizard_answers);
    fullRef.current = full;
    const failAt = getDemo().generate === "putus" ? Math.floor(full.length * 0.42) : Infinity;
    const myRun = ++runId.current;
    setPhase("streaming");
    setShown("");
    setElapsed(0);

    let pos = 0;
    const t0 = performance.now();
    const tick = () => {
      if (runId.current !== myRun) return;
      pos = Math.min(full.length, pos + 18 + Math.floor(Math.random() * 30));
      setShown(full.slice(0, pos));
      setElapsed((performance.now() - t0) / 1000);
      if (pos >= failAt) return setPhase("error"); // status tetap `draft`
      if (pos >= full.length) {
        setPhase("done");
        finalizePrd(id, full);
        setTimeout(() => runId.current === myRun && router.replace(`/prd/${id}`), 1400);
        return;
      }
      setTimeout(tick, 28);
    };
    setTimeout(tick, 600);
  }, [id, router]);

  useEffect(() => {
    start();
    const r = runId;
    return () => {
      r.current++;
    };
  }, [start]);

  // ikuti teks yang sedang ditulis
  useEffect(() => {
    const el = docRef.current;
    if (el && phase === "streaming") el.scrollTop = el.scrollHeight;
  }, [shown, phase]);

  const ratio = fullRef.current ? shown.length / fullRef.current.length : 0;
  const stageIdx = phase === "done" ? GENERATE_STAGES.length : Math.min(GENERATE_STAGES.length - 1, Math.floor(ratio * GENERATE_STAGES.length));

  return (
    <div className="container gen">
      <aside className="gen__side" aria-live="polite">
        <div className="gen__orb" data-done={phase === "done" || undefined} data-error={phase === "error" || undefined} aria-hidden="true" />
        <h1>
          {phase === "done" ? "PRD-mu sudah jadi!" : phase === "error" ? "Koneksi terputus" : "Sedang menyusun PRD-mu…"}
        </h1>
        <div className="gen__meta">
          <span>{Math.round(ratio * 100)}%</span>
          <span>·</span>
          <span>{elapsed.toFixed(1)} detik</span>
        </div>

        {phase === "error" ? (
          <div className="alert alert-danger" role="alert" style={{ marginTop: 22 }}>
            <WifiOff aria-hidden="true" />
            <div className="alert__body">
              Proses berhenti di tengah jalan. Tenang — <strong>jawaban wizard-mu aman</strong> dan PRD masih
              berstatus draft.
              <div className="alert__actions">
                <button type="button" className="btn btn-light btn-sm" onClick={start} id="gen-retry">
                  <RefreshCw aria-hidden="true" /> Buat PRD lagi
                </button>
                <Link href={`/wizard/${id}?langkah=8`} className="btn btn-ghost btn-sm" id="gen-back">
                  <ArrowLeft aria-hidden="true" /> Ke wizard
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="gen__bar">
              <span style={{ width: `${ratio * 100}%` }} />
            </div>
            <ol className="gen__stages">
              {GENERATE_STAGES.map((s, i) => (
                <li
                  key={s}
                  className="gen__stage"
                  data-state={i < stageIdx ? "done" : i === stageIdx ? "active" : "todo"}
                >
                  <i aria-hidden="true">{i < stageIdx && <Check strokeWidth={3} />}</i>
                  {s}
                </li>
              ))}
            </ol>
          </>
        )}
      </aside>

      <div className="card gen__doc" ref={docRef} aria-label="Pratinjau PRD" aria-busy={phase === "streaming"}>
        {shown ? <Markdown content={shown} /> : <div className="skeleton" style={{ height: 28, width: "60%" }} />}
        {phase === "streaming" && <span className="cursor" aria-hidden="true" />}
      </div>
    </div>
  );
}

export default function GeneratePage() {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="app-shell">
      <Aurora subtle />
      <div className="app-main">
        <AppNav>
          <span />
        </AppNav>
        <RequireAuth>
          <main id="main">
            <Generator id={id} />
          </main>
          <DemoPanel />
        </RequireAuth>
      </div>
    </div>
  );
}
