import type { WizardAnswers } from "./types";

/**
 * MOCK AI — dipakai selama tahap frontend.
 * Nanti diganti Route Handler yang memanggil Gemini (PRD §9A, §14).
 */

const get = (a: WizardAnswers, id: string) => {
  const v = a[id];
  if (!v || v.dilewati || !v.jawaban.trim()) return null;
  return v.jawaban.trim();
};

const asm = (value: string | null, fallback: string) => value ?? `${fallback} (ASUMSI)`;

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

/* ---------------------------------------------------------------- drafts */

export function mockDraft(questionId: string, a: WizardAnswers): string {
  const users = get(a, "3.1") ?? "pengguna utama";
  const nama = get(a, "1.1") ?? "aplikasimu";
  switch (questionId) {
    case "3.4":
      return [
        `• \`admin\` — Pemilik ${nama}: mengelola pengguna, melihat semua data & laporan.`,
        `• \`user\` — ${users.split(",")[0]}: membuat dan mengelola data miliknya sendiri.`,
        `• \`viewer\` — Atasan/pemantau: hanya melihat ringkasan dan laporan.`,
      ].join("\n");
    case "4.2": {
      const features = (get(a, "4.1") ?? "Login\nFitur utama\nDashboard")
        .split(/\n|,/)
        .map((f) => f.trim())
        .filter(Boolean);
      return features
        .map((f, i) => `• ${i < Math.ceil(features.length / 2) ? "P0 — Wajib" : "P1 — Sebaiknya"}: ${f}`)
        .join("\n");
    }
    case "4.3":
      return [
        "• Koneksi internet putus saat pengguna sedang mengisi data → data tersimpan sementara & dikirim ulang.",
        "• Dua pengguna mengubah data yang sama bersamaan → simpan versi terakhir & beri notifikasi.",
        "• Pengguna mengunggah file terlalu besar → tolak dengan pesan batas ukuran yang jelas.",
        "• Pengguna menghapus data penting → minta konfirmasi sebelum hapus permanen.",
      ].join("\n");
    case "8.2":
      return [
        "Tabel: `profiles` · `items` · `activities` · `notifications`",
        "",
        "Tahap 1 — Fondasi: login, tabel + RLS, layout dasar",
        "Tahap 2 — Fitur inti P0",
        "Tahap 3 — Notifikasi & dashboard",
        "Tahap 4 — Perapian UI & tes menyeluruh",
      ].join("\n");
    default:
      return "";
  }
}

/* ------------------------------------------------------------ PRD output */

export function buildMockPrd(a: WizardAnswers): string {
  const nama = get(a, "1.1") ?? "Aplikasi Baru";
  const ide = asm(get(a, "1.2"), "Aplikasi web untuk membantu pengguna menyelesaikan pekerjaan rutin lebih cepat");
  const jenis = asm(get(a, "1.3"), "Web App");
  const perangkat = asm(get(a, "1.4"), "Laptop / Desktop, tetap nyaman di HP");
  const masalah = asm(get(a, "2.1"), "Proses masih manual dan sering terlewat");
  const caraSekarang = asm(get(a, "2.2"), "Spreadsheet dan grup chat");
  const dampak = asm(get(a, "2.3"), "Waktu terbuang dan keputusan diambil tanpa data");
  const pengguna = asm(get(a, "3.1"), "Pengguna umum");
  const kebutuhan = asm(get(a, "3.2"), "Menyelesaikan tugas utama dengan cepat");
  const bisnis = asm(get(a, "3.3"), "Gratis untuk MVP");
  const roles = get(a, "3.4") ?? mockDraft("3.4", a) + " (ASUMSI)";
  const fitur = (get(a, "4.1") ?? "Login\nFitur utama\nDashboard")
    .split(/\n|,/)
    .map((f) => f.trim())
    .filter(Boolean);
  const edge = get(a, "4.3") ?? mockDraft("4.3", a);
  const tidakDibuat = get(a, "5.1");
  const launch = asm(get(a, "5.2"), "1 bulan");
  const jumlah = asm(get(a, "6.1"), "100–1.000 pengguna");
  const offline = asm(get(a, "6.2"), "Tidak");
  const bahasa = asm(get(a, "6.3"), "Bahasa Indonesia");
  const ai = asm(get(a, "7.1"), "Tidak");
  const sensitif = asm(get(a, "7.2"), "Email dan nama pengguna");
  const integrasi = asm(get(a, "7.3"), "Login dengan Google");
  const stack = asm(get(a, "8.1"), "Next.js · Supabase · Vercel");
  const sukses = asm(get(a, "8.3"), "≥ 50% pengguna aktif mingguan setelah 1 bulan");
  const today = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  const fiturRows = fitur
    .map(
      (f, i) =>
        `| US-${String(i + 1).padStart(2, "0")} | ${f} | Sebagai **Pengguna**, saya ingin ${f.toLowerCase()} agar pekerjaan saya lebih mudah. | ${
          i < Math.ceil(fitur.length / 2) ? "P0 — Wajib" : "P1 — Sebaiknya"
        } |`,
    )
    .join("\n");

  return `# Product Requirements Document (PRD)

## ${nama} — MVP

| Info | Detail |
| :--- | :--- |
| **Versi Dokumen** | v1.0 |
| **Tanggal** | ${today} |
| **Status** | Draft |
| **Tipe Produk** | ${jenis} |
| **Platform** | ${perangkat} |
| **Tech Stack** | ${stack} |
| **Target Launch** | ${launch} |

---

### 1. Ringkasan Produk

${nama} adalah ${ide.charAt(0).toLowerCase() + ide.slice(1)}

**Satu kalimat (elevator pitch):** ${nama} membantu ${pengguna.split(",")[0].toLowerCase()} menyelesaikan masalah utamanya tanpa ribet.

---

### 2. Masalah yang Diselesaikan

| # | Masalah | Cara Mengatasi Saat Ini | Dampak Jika Tidak Diselesaikan |
| :--- | :--- | :--- | :--- |
| M-01 | ${masalah} | ${caraSekarang} | ${dampak} |

**Bukti masalah:** Belum divalidasi dengan calon pengguna (ASUMSI).

---

### 3. Tujuan dan Batasan Scope

#### 3.1 Tujuan Versi Ini

| # | Tujuan | Diukur di Metrik |
| :--- | :--- | :--- |
| T-01 | Pengguna bisa menyelesaikan alur utama tanpa bantuan. | MET-01 |
| T-02 | Pengguna kembali memakai aplikasi setiap minggu (ASUMSI). | MET-02 |

#### 3.2 Yang TIDAK Dibuat di Versi 1

| Tidak Dibuat | Alasan |
| :--- | :--- |
${
  tidakDibuat
    ? tidakDibuat
        .split(/,|\n/)
        .map((t) => t.trim().replace(/\.$/, ""))
        .filter(Boolean)
        .map((t) => `| ${t} | Ditunda ke versi berikutnya. |`)
        .join("\n")
    : "| Pembayaran / langganan (ASUMSI) | Fokus validasi minat dulu. |\n| Panel admin terpisah (ASUMSI) | Data cukup dilihat di dashboard database. |"
}

---

### 4. Pengguna dan Hak Akses

#### 4.1 Siapa Penggunanya

| Tipe | Siapa | Kebutuhan Utama |
| :--- | :--- | :--- |
| 👤 **Pengguna Harian** | ${pengguna} | ${kebutuhan} |

**Model Bisnis:** ${bisnis}

#### 4.2 Daftar Role di Sistem

${roles}

---

### 5. Alur Utama Pengguna

1. **Masuk**: pengguna membuka aplikasi dan login. — *US-01*
2. **Pakai fitur inti**: pengguna menjalankan ${fitur[0]?.toLowerCase() ?? "fitur utama"}. — *US-01*
3. **Lihat hasil**: pengguna melihat ringkasan & riwayat. — *US-0${Math.min(fitur.length, 9)}*

---

### 6. Fitur MVP

| ID | Nama Fitur | User Story | Prioritas |
| :--- | :--- | :--- | :--- |
${fiturRows}

#### 6.2 Edge Case yang Harus Ditangani

${edge}

---

### 7. Kebutuhan Non-Fungsional

| Aspek | Kebutuhan |
| :--- | :--- |
| **Perangkat Utama** | ${perangkat} |
| **Performa** | Halaman tampil < 3 detik di koneksi 4G (ASUMSI) |
| **Koneksi Internet** | Offline: ${offline} |
| **Bahasa Antarmuka** | ${bahasa} |
| **Jumlah Pengguna (perkiraan)** | ${jumlah} |

---

### 8. Data yang Perlu Disimpan

**Aturan Akses Data:** Semua tabel memakai Row Level Security. Pengguna hanya bisa membaca data miliknya sendiri.

${get(a, "8.2") ?? mockDraft("8.2", a) + "\n\n(ASUMSI)"}

---

### 9. Modul Tambahan

| Aspek | Detail |
| :--- | :--- |
| **Fitur AI** | ${ai} |
| **Data sensitif** | ${sensitif} |
| **Integrasi** | ${integrasi} |

---

### 10. Ukuran Sukses

| ID | Metrik | Target | Waktu |
| :--- | :--- | :--- | :--- |
| MET-01 | ${sukses} | Sesuai target | 4 minggu setelah launch |
| MET-02 | Retensi mingguan | ≥ 30% (ASUMSI) | 4 minggu setelah launch |

---

### 11. Asumsi dan Risiko

| # | Asumsi / Risiko | Dampak Jika Salah | Cara Memvalidasi |
| :--- | :--- | :--- | :--- |
| A-01 | Masalah di §2 benar-benar dirasakan calon pengguna. | 🔴 Tinggi | Wawancara 5–10 calon pengguna. |
| A-02 | Calon pengguna mau berpindah dari cara lama (${caraSekarang.replace(" (ASUMSI)", "")}). | 🔴 Tinggi | Uji coba dengan 3 pengguna pertama. |
| A-03 | Jumlah pengguna sesuai perkiraan di §7. | 🟡 Sedang | Pantau analytics bulan pertama. |
| A-04 | Tech stack sesuai kemampuan tim. | 🟢 Rendah | Konfirmasi pemilik produk. |

---

### 12. Tahapan Pengerjaan

| Tahap | Isi | Selesai Jika | Target |
| :--- | :--- | :--- | :--- |
| 1 | Fondasi: setup, login, tabel + RLS | Login & RLS teruji | Minggu 1 |
| 2 | Fitur inti P0 | Semua kriteria P0 terpenuhi | Minggu 2–3 |
| 3 | Fitur P1, perapian UI, tes menyeluruh | Siap launch | Minggu 4 (ASUMSI) |

---

### 13. Pertanyaan Terbuka

| # | Pertanyaan | Siapa yang Memutuskan |
| :--- | :--- | :--- |
| Q-01 | Bagaimana rencana monetisasi setelah MVP? | Pemilik produk |
| Q-02 | Apakah nama "${nama}" sudah final? | Pemilik produk |

---

### 14. Instruksi untuk AI Coding Agent

1. **Kerjakan per tahap** sesuai Bagian 12. Selesaikan dan tes satu tahap sebelum lanjut.
2. **Jangan membangun** apa pun yang ada di Bagian 3.2.
3. **Gunakan nama role, tabel, dan kolom persis** seperti di Bagian 4.2 dan 8.
4. **Jika menemukan hal yang tidak jelas**, tanyakan ke user — terutama untuk item di Bagian 11 dan 13.
`;
}

export function countAssumptions(md: string) {
  const total = (md.match(/\(ASUMSI\)/g) ?? []).length;
  const high = (md.match(/🔴/g) ?? []).length;
  return { total, high };
}

export function extractToc(md: string) {
  return md
    .split("\n")
    .filter((l) => l.startsWith("### "))
    .map((l) => {
      const text = l.replace(/^###\s+/, "").trim();
      return { text, id: slugify(text) };
    });
}

export const GENERATE_STAGES = [
  "Membaca jawabanmu…",
  "Menyusun ringkasan & masalah…",
  "Menyusun pengguna & hak akses…",
  "Menyusun fitur…",
  "Menulis data & tahapan…",
  "Mengumpulkan asumsi…",
  "Mengecek struktur PRD…",
];
