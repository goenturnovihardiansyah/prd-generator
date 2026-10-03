import Link from "next/link";
import {
  ArrowRight,
  CircleCheck,
  Copy,
  Download,
  FileClock,
  Languages,
  ListChecks,
  Plus,
  Radio,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { Aurora } from "@/components/Aurora";
import { LandingNav } from "@/components/landing/LandingNav";
import { PromptBox } from "@/components/landing/PromptBox";

const FAQ = [
  {
    q: "Saya bukan PM. Apakah tetap bisa memakai ini?",
    a: "Bisa. Pertanyaan di wizard ditulis dalam Bahasa Indonesia sehari-hari tanpa istilah PM, dan setiap pertanyaan punya contoh jawaban. Pertanyaan yang belum bisa dijawab boleh dilewati.",
  },
  {
    q: "Apa itu tanda (ASUMSI)?",
    a: "Bagian yang tidak kamu jawab akan diisi AI dengan tebakan paling masuk akal, lalu diberi tanda ASUMSI. Jadi kamu tahu persis bagian mana yang masih perlu dipastikan — tidak ada tebakan yang tersembunyi.",
  },
  {
    q: "Bagaimana cara memakai PRD-nya?",
    a: "Klik Salin atau Unduh .md, tempel ke Antigravity, Claude, atau Cursor, lalu minta: “Bangun Tahap 1 sesuai PRD ini.” PRD sudah berisi instruksi khusus untuk AI coding agent.",
  },
  {
    q: "Apakah ide saya aman?",
    a: "PRD hanya bisa dilihat oleh akunmu sendiri, dan kamu bisa menghapusnya permanen kapan saja. Ide produkmu tidak dipakai untuk melatih model AI.",
  },
  {
    q: "Berapa biayanya?",
    a: "Gratis selama masa MVP, dengan batas pemakaian harian supaya layanan tetap adil untuk semua pengguna.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* ------------------------------------------------------------ HERO */}
      <section className="hero-stage" aria-labelledby="hero-title">
        <Aurora />
        <LandingNav />
        <div className="hero">
          <div className="hero__badge reveal">
            <b>Baru</b> Untuk vibe coder & PM pemula
          </div>
          <h1 id="hero-title" className="reveal d-1">
            Dari Ide ke PRD, <em>Tanpa Ribet</em>
          </h1>
          <p className="hero__sub reveal d-2">
            Jawab pertanyaan sederhana dalam Bahasa Indonesia, dapatkan PRD lengkap yang langsung bisa ditempel ke
            AI coding agent-mu.
          </p>
          <PromptBox />
        </div>
        <div className="hero-foot reveal d-4">Siap untuk Antigravity, Claude & Cursor</div>
      </section>

      <main id="main">
        {/* ------------------------------------------------------ CARA KERJA */}
        <section className="section" id="cara-kerja" aria-labelledby="cara-kerja-title">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Cara kerja</span>
              <h2 id="cara-kerja-title">Tiga langkah, sekitar 20 menit.</h2>
              <p>Tidak perlu tahu template PRD. Cukup ceritakan idemu — sisanya dibantu AI.</p>
            </div>

            <div className="steps">
              <article className="card step-card">
                <div className="step-card__visual" aria-hidden="true">
                  <div className="mini-progress">
                    <div className="mini-progress__bar">
                      <span />
                    </div>
                    <div className="mini-progress__dots">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <i key={n} className={n <= 5 ? "on" : ""}>
                          {n}
                        </i>
                      ))}
                    </div>
                    <div className="mini-q" />
                    <div className="mini-q" style={{ width: "45%", marginTop: 8 }} />
                  </div>
                </div>
                <span className="step-card__num">01</span>
                <h3>Jawab 8 langkah pertanyaan</h3>
                <p>Pertanyaan sederhana dengan contoh jawaban. Belum tahu? Klik “Saya belum tahu” dan lanjut.</p>
              </article>

              <article className="card step-card">
                <div className="step-card__visual" aria-hidden="true">
                  <div className="mini-draft">
                    <div className="mini-draft__head">
                      <Sparkles /> Draft dari AI
                    </div>
                    <div className="mini-draft__line" style={{ width: "92%" }} />
                    <div className="mini-draft__line" style={{ width: "76%" }} />
                    <div className="mini-draft__line" style={{ width: "84%" }} />
                    <div className="mini-draft__actions">
                      <span>Setuju</span>
                      <span>Edit</span>
                    </div>
                  </div>
                </div>
                <span className="step-card__num">02</span>
                <h3>AI bantu bagian yang sulit</h3>
                <p>Peran pengguna, prioritas fitur, edge case, dan tabel data disusun AI. Kamu tinggal koreksi.</p>
              </article>

              <article className="card step-card">
                <div className="step-card__visual" aria-hidden="true">
                  <div className="mini-code">
                    <span className="mini-code__copy">
                      <Copy /> Salin
                    </span>
                    <div>
                      <b>###</b> 1. Ringkasan Produk
                    </div>
                    <div>
                      <b>###</b> 6. Fitur MVP
                    </div>
                    <div>
                      | US-01 | Login Google | <b>P0</b> |
                    </div>
                    <div>
                      <b>###</b> 14. Instruksi untuk AI…
                    </div>
                  </div>
                </div>
                <span className="step-card__num">03</span>
                <h3>Tempel ke AI agent-mu</h3>
                <p>Salin atau unduh Markdown, lalu minta agent-mu: “Bangun Tahap 1 sesuai PRD ini.”</p>
              </article>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- CONTOH */}
        <section className="section" id="contoh" aria-labelledby="contoh-title" style={{ paddingTop: 40 }}>
          <div className="container showcase">
            <div>
              <span className="eyebrow">Transparan</span>
              <div className="section-head" style={{ marginBottom: 0 }}>
                <h2 id="contoh-title">Asumsi yang terlihat, bukan tersembunyi.</h2>
                <p>
                  PRD buatan AI biasanya penuh tebakan yang tak terlihat. Di sini, setiap tebakan ditandai — jadi AI
                  agent-mu tidak membangun di atas asumsi yang salah.
                </p>
              </div>
              <ul className="check-list">
                <li>
                  <CircleCheck aria-hidden="true" />
                  <span>
                    <strong>Tag ASUMSI berwarna</strong> di setiap bagian yang ditebak AI.
                  </span>
                </li>
                <li>
                  <CircleCheck aria-hidden="true" />
                  <span>
                    <strong>Ringkasan risiko</strong> — berapa asumsi, mana yang berdampak tinggi.
                  </span>
                </li>
                <li>
                  <CircleCheck aria-hidden="true" />
                  <span>
                    <strong>Struktur konsisten</strong> 14 bagian yang mudah dibaca AI coding agent.
                  </span>
                </li>
              </ul>
            </div>

            <div className="doc-window">
              <div className="doc-window__inner">
                <div className="doc-window__bar" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <span>prd-mesinku.md</span>
                </div>
                <div className="doc-window__body">
                  <div className="assume-card">
                    <div className="assume-card__icon">
                      <TriangleAlert aria-hidden="true" />
                    </div>
                    <div>
                      <strong>PRD ini memiliki 12 asumsi, 3 berdampak tinggi</strong>
                      <span>Lihat Bagian 11 untuk cara memvalidasinya →</span>
                    </div>
                  </div>
                  <div className="doc-line">
                    <h4>### 4. Pengguna dan Hak Akses</h4>
                    Teknisi lapangan, supervisor maintenance, dan manajer pabrik. Model bisnis: gratis untuk MVP{" "}
                    <span className="assume-tag">ASUMSI</span>
                  </div>
                  <div className="doc-line">
                    <h4>### 7. Kebutuhan Non-Fungsional</h4>
                    Halaman tampil &lt; 3 detik di koneksi 4G <span className="assume-tag">ASUMSI</span> · Bisa dipakai
                    di HP (layar ≥ 360px)
                  </div>
                  <div className="doc-line">
                    <h4>### 12. Tahapan Pengerjaan</h4>
                    Tahap 1 — Fondasi: login, tabel + RLS, layout dasar. Target minggu ke-1{" "}
                    <span className="assume-tag">ASUMSI</span>
                  </div>
                </div>
              </div>
              <div className="float-badge" aria-hidden="true">
                <Copy /> PRD disalin
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------- FITUR */}
        <section className="section" id="fitur" aria-labelledby="fitur-title">
          <div className="container">
            <div className="section-head section-head--center">
              <span className="eyebrow">Fitur</span>
              <h2 id="fitur-title">Semua yang kamu butuhkan untuk PRD pertamamu.</h2>
            </div>
            <div className="bento">
              <article className="card bento-item bento-item--wide">
                <div className="bento-item__icon">
                  <ListChecks aria-hidden="true" />
                </div>
                <h3>Wizard 8 langkah</h3>
                <p>Satu topik per langkah, dengan contoh jawaban dan tombol pilihan — bukan dropdown yang membingungkan.</p>
              </article>
              <article className="card bento-item bento-item--wide">
                <div className="bento-item__icon">
                  <Sparkles aria-hidden="true" />
                </div>
                <h3>Draft jawaban dari AI</h3>
                <p>Untuk pertanyaan sulit, AI mengusulkan jawaban dari jawabanmu sebelumnya dalam hitungan detik.</p>
              </article>
              <article className="card bento-item">
                <div className="bento-item__icon">
                  <Radio aria-hidden="true" />
                </div>
                <h3>Tampil bertahap</h3>
                <p>PRD ditulis langsung di layar, lengkap dengan indikator progres.</p>
              </article>
              <article className="card bento-item">
                <div className="bento-item__icon">
                  <Download aria-hidden="true" />
                </div>
                <h3>Salin & unduh .md</h3>
                <p>Satu klik, siap ditempel ke AI coding agent favoritmu.</p>
              </article>
              <article className="card bento-item">
                <div className="bento-item__icon">
                  <FileClock aria-hidden="true" />
                </div>
                <h3>Tersimpan otomatis</h3>
                <p>Tutup browser kapan saja — lanjutkan dari langkah terakhir.</p>
              </article>
            </div>
          </div>
        </section>

        <div className="container">
          <div className="agents">
            <span className="agents__label">Dirancang untuk</span>
            <span className="agents__name">Antigravity</span>
            <span className="agents__name">Claude</span>
            <span className="agents__name">Cursor</span>
            <span className="agents__label" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Languages size={16} aria-hidden="true" /> 100% Bahasa Indonesia
            </span>
          </div>
        </div>

        {/* ------------------------------------------------------------- FAQ */}
        <section className="section" id="faq" aria-labelledby="faq-title">
          <div className="container">
            <div className="section-head section-head--center">
              <span className="eyebrow">FAQ</span>
              <h2 id="faq-title">Pertanyaan yang sering muncul</h2>
            </div>
            <div className="faq">
              {FAQ.map((f, i) => (
                <details key={f.q} open={i === 0}>
                  <summary>
                    {f.q}
                    <Plus aria-hidden="true" />
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- CTA */}
        <section className="cta" aria-labelledby="cta-title">
          <Aurora />
          <h2 id="cta-title">Idemu layak dibangun dengan benar.</h2>
          <p>Mulai dengan PRD yang jelas. Gratis, sekitar 20 menit, dalam Bahasa Indonesia.</p>
          <Link href="/masuk?next=/wizard/baru" className="btn btn-light btn-lg" id="cta-start">
            Buat PRD sekarang <ArrowRight aria-hidden="true" />
          </Link>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <span>© 2026 PRD Generator</span>
          <nav aria-label="Tautan footer">
            <Link href="/kebijakan-privasi">Kebijakan Privasi</Link>
            <a href="#faq">FAQ</a>
          </nav>
        </div>
      </footer>
    </>
  );
}
