/**
 * Konfigurasi wizard sebagai DATA (lihat PRD §14 — "UI wizard harus generik").
 * Untuk tahap frontend ini, isinya diturunkan dari PRD karena
 * `templates/wizard-questions.md` belum tersedia. Kunci pertanyaan (1.1, 3.4, dst.)
 * dipakai sebagai key di `wizard_answers`.
 */

export type QuestionType = "text" | "textarea" | "choice" | "multi" | "ai-draft";

export interface Question {
  id: string;
  label: string;
  help?: string;
  example: string;
  type: QuestionType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

export interface WizardStep {
  id: number;
  title: string;
  short: string;
  description: string;
  prdSections: string[];
  questions: Question[];
}

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: 1,
    title: "Ceritakan idemu",
    short: "Ide Produk",
    description: "Mulai dari yang paling sederhana. Tidak perlu sempurna — jawaban singkat juga boleh.",
    prdSections: ["§1 Ringkasan Produk"],
    questions: [
      {
        id: "1.1",
        label: "Apa nama aplikasimu?",
        help: "Nama sementara juga tidak apa-apa.",
        example: "MesinKu",
        type: "text",
        required: true,
        placeholder: "Tulis nama aplikasi…",
      },
      {
        id: "1.2",
        label: "Jelaskan idemu dalam 1–2 kalimat",
        help: "Bayangkan kamu sedang menjelaskan ke teman.",
        example:
          "Aplikasi untuk teknisi pabrik mencatat jadwal perawatan mesin dan melaporkan kerusakan langsung dari HP.",
        type: "textarea",
        required: true,
        placeholder: "Aplikasi untuk…",
      },
      {
        id: "1.3",
        label: "Aplikasimu termasuk jenis apa?",
        example: "Web App",
        type: "choice",
        options: ["Web App", "Mobile App", "SaaS B2B", "Tool Internal"],
      },
      {
        id: "1.4",
        label: "Biasanya dipakai di perangkat apa?",
        help: "Boleh pilih lebih dari satu.",
        example: "Laptop / Desktop, HP",
        type: "multi",
        options: ["Laptop / Desktop", "HP", "Tablet"],
      },
    ],
  },
  {
    id: 2,
    title: "Masalah apa yang diselesaikan?",
    short: "Masalah",
    description: "Produk yang bagus berangkat dari masalah yang nyata. Ceritakan apa yang bikin repot.",
    prdSections: ["§2 Masalah yang Diselesaikan"],
    questions: [
      {
        id: "2.1",
        label: "Apa yang paling bikin repot calon penggunamu?",
        example: "Jadwal perawatan mesin sering terlewat karena masih dicatat di buku dan grup WhatsApp.",
        type: "textarea",
        required: true,
      },
      {
        id: "2.2",
        label: "Sekarang mereka mengatasinya dengan cara apa?",
        example: "Mencatat di Excel yang dibagikan lewat WhatsApp, lalu supervisor mengecek manual tiap minggu.",
        type: "textarea",
      },
      {
        id: "2.3",
        label: "Apa yang terjadi kalau masalah ini dibiarkan?",
        example: "Mesin rusak mendadak, produksi berhenti, dan biaya perbaikan jadi jauh lebih mahal.",
        type: "textarea",
      },
    ],
  },
  {
    id: 3,
    title: "Siapa yang akan memakainya?",
    short: "Pengguna",
    description: "Kenali penggunamu. AI akan membantu menyusun peran dan hak aksesnya.",
    prdSections: ["§4 Pengguna dan Hak Akses"],
    questions: [
      {
        id: "3.1",
        label: "Siapa saja yang akan memakai aplikasimu?",
        example: "Teknisi lapangan, supervisor maintenance, dan manajer pabrik.",
        type: "textarea",
        required: true,
      },
      {
        id: "3.2",
        label: "Apa yang paling mereka butuhkan dari aplikasimu?",
        example: "Teknisi butuh checklist yang cepat diisi di HP, supervisor butuh ringkasan mesin yang bermasalah.",
        type: "textarea",
      },
      {
        id: "3.3",
        label: "Bagaimana aplikasimu menghasilkan uang?",
        example: "Gratis dulu",
        type: "choice",
        options: ["Gratis dulu", "Langganan bulanan", "Bayar sekali", "Iklan"],
      },
      {
        id: "3.4",
        label: "Peran pengguna & hak aksesnya",
        help: "AI menyusun draft dari jawabanmu. Kamu tinggal setuju atau mengedit.",
        example: "`teknisi` — mengisi checklist & melapor kerusakan",
        type: "ai-draft",
      },
    ],
  },
  {
    id: 4,
    title: "Fitur apa yang kamu bayangkan?",
    short: "Fitur",
    description: "Tulis semua yang terlintas. AI akan membantu memilah mana yang wajib di versi pertama.",
    prdSections: ["§5 Alur Utama", "§6 Fitur MVP"],
    questions: [
      {
        id: "4.1",
        label: "Sebutkan fitur-fitur yang kamu bayangkan",
        help: "Satu fitur per baris lebih mudah dibaca.",
        example: "Jadwal perawatan otomatis\nChecklist harian\nLapor kerusakan dengan foto\nDashboard supervisor",
        type: "textarea",
        required: true,
      },
      {
        id: "4.2",
        label: "Prioritas fitur untuk versi pertama",
        help: "P0 = wajib ada, P1 = sebaiknya ada.",
        example: "P0 — Checklist harian",
        type: "ai-draft",
      },
      {
        id: "4.3",
        label: "Apa saja yang bisa salah?",
        help: "Edge case: kondisi tidak biasa yang tetap harus ditangani aplikasi.",
        example: "Teknisi kehilangan sinyal saat mengisi checklist",
        type: "ai-draft",
      },
    ],
  },
  {
    id: 5,
    title: "Apa yang tidak dibuat dulu?",
    short: "Batasan",
    description: "Batasan scope mencegah AI agent membangun hal yang belum kamu butuhkan.",
    prdSections: ["§3 Tujuan dan Batasan Scope", "§12 Tahapan"],
    questions: [
      {
        id: "5.1",
        label: "Fitur apa yang sengaja ditunda ke versi berikutnya?",
        example: "Pembayaran, aplikasi iOS, integrasi dengan mesin IoT.",
        type: "textarea",
      },
      {
        id: "5.2",
        label: "Kapan targetmu meluncur?",
        example: "1 bulan",
        type: "choice",
        options: ["2 minggu", "1 bulan", "2–3 bulan", "Lebih dari 3 bulan"],
      },
    ],
  },
  {
    id: 6,
    title: "Seberapa besar & cepat?",
    short: "Kualitas",
    description: "Hal-hal di luar fitur yang tetap penting: jumlah pengguna, koneksi, dan bahasa.",
    prdSections: ["§7 Kebutuhan Non-Fungsional"],
    questions: [
      {
        id: "6.1",
        label: "Kira-kira berapa pengguna di bulan pertama?",
        example: "100–1.000",
        type: "choice",
        options: ["< 100", "100–1.000", "1.000–10.000", "> 10.000"],
      },
      {
        id: "6.2",
        label: "Apakah harus tetap bisa dipakai tanpa internet?",
        example: "Sebagian",
        type: "choice",
        options: ["Ya", "Tidak", "Sebagian"],
      },
      {
        id: "6.3",
        label: "Bahasa tampilan aplikasi",
        example: "Bahasa Indonesia",
        type: "multi",
        options: ["Bahasa Indonesia", "Bahasa Inggris"],
      },
    ],
  },
  {
    id: 7,
    title: "Modul tambahan",
    short: "Modul",
    description: "AI, keamanan data, dan integrasi dengan layanan lain.",
    prdSections: ["§9 Modul Tambahan"],
    questions: [
      {
        id: "7.1",
        label: "Apakah ada fitur yang memakai AI?",
        example: "Mungkin nanti",
        type: "choice",
        options: ["Ya", "Tidak", "Mungkin nanti"],
      },
      {
        id: "7.2",
        label: "Data sensitif apa yang akan disimpan?",
        example: "Nama dan nomor HP teknisi, foto kondisi mesin di area pabrik.",
        type: "textarea",
      },
      {
        id: "7.3",
        label: "Perlu terhubung dengan aplikasi lain?",
        example: "Login dengan Google, kirim pengingat lewat WhatsApp.",
        type: "textarea",
      },
    ],
  },
  {
    id: 8,
    title: "Data & tahapan pengerjaan",
    short: "Data & Tahapan",
    description: "Langkah terakhir! AI menyusun struktur data dan urutan pengerjaan untuk AI agent-mu.",
    prdSections: ["§8 Data", "§10 Ukuran Sukses", "§12 Tahapan"],
    questions: [
      {
        id: "8.1",
        label: "Teknologi yang ingin dipakai",
        example: "Next.js + Supabase",
        type: "choice",
        options: ["Next.js + Supabase", "Laravel + MySQL", "Flutter + Firebase", "Serahkan ke AI"],
      },
      {
        id: "8.2",
        label: "Tabel data & tahapan pengerjaan",
        example: "`machines` · `maintenance_schedules` · `reports`",
        type: "ai-draft",
      },
      {
        id: "8.3",
        label: "Bagaimana kamu tahu aplikasimu berhasil?",
        example: "80% jadwal perawatan dikerjakan tepat waktu dalam 2 bulan pertama.",
        type: "textarea",
      },
    ],
  },
];

export const TOTAL_STEPS = WIZARD_STEPS.length;

export const ALL_QUESTIONS = WIZARD_STEPS.flatMap((s) => s.questions);
