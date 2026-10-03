"use client";

import { useState } from "react";
import { FlaskConical } from "lucide-react";
import { setDemo, useDemo } from "@/lib/store";

/**
 * Panel khusus tahap review frontend: mensimulasikan skenario gagal
 * dari Kriteria Penerimaan (AI sibuk, batas harian, koneksi putus).
 * Dihapus saat backend asli terpasang.
 */
export function DemoPanel() {
  const demo = useDemo();
  const [open, setOpen] = useState(false);

  return (
    <div className="demo-panel">
      {open && (
        <div className="demo-panel__body" role="dialog" aria-label="Mode demo">
          <h3>Mode Demo</h3>
          <p>Simulasikan skenario gagal dari PRD untuk review UI.</p>
          <div className="demo-panel__group">
            <label>Draft AI (US-03)</label>
            <div className="seg">
              {(
                [
                  ["normal", "Normal"],
                  ["sibuk", "AI sibuk"],
                  ["limit", "Batas harian"],
                ] as const
              ).map(([v, l]) => (
                <button key={v} type="button" aria-pressed={demo.ai === v} onClick={() => setDemo({ ai: v })}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="demo-panel__group" style={{ marginBottom: 0 }}>
            <label>Generate PRD (US-04)</label>
            <div className="seg">
              {(
                [
                  ["normal", "Normal"],
                  ["putus", "Koneksi putus"],
                ] as const
              ).map(([v, l]) => (
                <button key={v} type="button" aria-pressed={demo.generate === v} onClick={() => setDemo({ generate: v })}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <button
        type="button"
        className="demo-panel__toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        id="demo-panel-toggle"
      >
        <FlaskConical aria-hidden="true" /> Mode Demo
      </button>
    </div>
  );
}
