"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { getUser, setPendingIdea } from "@/lib/store";

const TYPES = ["Web App", "Mobile App", "SaaS B2B", "Tool Internal"];

const IDEAS = [
  "Aplikasi untuk teknisi pabrik mencatat jadwal perawatan mesin…",
  "Kasir sederhana untuk kedai kopi yang bisa lihat menu terlaris…",
  "Platform booking lapangan futsal dengan pembayaran QRIS…",
  "Tool internal untuk HR mengelola cuti karyawan…",
];

/** Placeholder yang "mengetik" sendiri — micro-interaction kecil di hero. */
function useTypewriter(active: boolean) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (!active) return;
    let idea = 0;
    let i = 0;
    let deleting = false;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const full = IDEAS[idea];
      if (!deleting) {
        i++;
        setText(full.slice(0, i));
        if (i === full.length) {
          deleting = true;
          t = setTimeout(tick, 2200);
          return;
        }
        t = setTimeout(tick, 38);
      } else {
        i -= 2;
        setText(full.slice(0, Math.max(i, 0)));
        if (i <= 0) {
          deleting = false;
          idea = (idea + 1) % IDEAS.length;
          t = setTimeout(tick, 400);
          return;
        }
        t = setTimeout(tick, 18);
      }
    };
    t = setTimeout(tick, 700);
    return () => clearTimeout(t);
  }, [active]);
  return text;
}

export function PromptBox() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [type, setType] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const typed = useTypewriter(!focused && !idea);

  // auto-grow
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [idea]);

  const submit = () => {
    setPendingIdea({ text: idea.trim(), type });
    router.push(getUser() ? "/wizard/baru" : "/masuk?next=/wizard/baru");
  };

  return (
    <form
      className="prompt reveal d-3"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <label htmlFor="hero-idea" className="prompt__label">
        Ide aplikasimu
      </label>
      <textarea
        id="hero-idea"
        ref={ref}
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder={focused ? "Ceritakan ide aplikasimu dalam 1–2 kalimat…" : typed || " "}
        rows={3}
      />
      <div className="prompt__row">
        <div className="prompt__chips" role="group" aria-label="Jenis produk">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              className="chip"
              aria-pressed={type === t}
              onClick={() => setType((cur) => (cur === t ? null : t))}
              id={`hero-type-${t.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {t}
            </button>
          ))}
        </div>
        <button type="submit" className="btn btn-dark" id="hero-generate">
          Buat PRD <ArrowUpRight aria-hidden="true" />
        </button>
      </div>
      <p className="prompt__hint">
        Gratis · Tanpa kartu kredit · <kbd>Ctrl</kbd> + <kbd>Enter</kbd> untuk mulai
      </p>
    </form>
  );
}
