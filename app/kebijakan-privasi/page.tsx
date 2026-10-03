import type { Metadata } from "next";
import { AppNav } from "@/components/AppNav";
import { Aurora } from "@/components/Aurora";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Data apa yang disimpan PRD Generator dan untuk apa, sesuai UU Pelindungan Data Pribadi.",
};

export default function PrivacyPage() {
  return (
    <div className="app-shell">
      <Aurora subtle />
      <div className="app-main">
        <AppNav>
          <span />
        </AppNav>
        <main id="main" className="container">
          <article className="card legal prose">
            <h1>Kebijakan Privasi</h1>
            <h2>Berlaku sejak 3 Oktober 2026</h2>
            <p>
              Kami menghormati privasimu dan mengikuti Undang-Undang Pelindungan Data Pribadi (UU PDP). Halaman ini
              menjelaskan secara singkat data apa yang kami simpan dan untuk apa.
            </p>
            <h3 id="data">Data yang kami simpan</h3>
            <ul>
              <li>
                <strong>Akun Google:</strong> nama, email, dan foto profil — untuk login dan menampilkan akunmu.
              </li>
              <li>
                <strong>Jawaban wizard & isi PRD:</strong> untuk menyusun dan menyimpan PRD-mu.
              </li>
              <li>
                <strong>Data pemakaian:</strong> misalnya kapan PRD dibuat, disalin, atau dinilai — untuk memperbaiki
                layanan.
              </li>
            </ul>
            <h3 id="perlindungan">Bagaimana kami melindunginya</h3>
            <ul>
              <li>PRD hanya bisa dibaca oleh akunmu sendiri.</li>
              <li>Ide produkmu tidak dipakai untuk melatih model AI.</li>
              <li>Kunci layanan AI hanya dipakai di server, tidak pernah dikirim ke browser.</li>
            </ul>
            <h3 id="hak">Hakmu</h3>
            <p>
              Kamu bisa menghapus PRD secara permanen kapan saja dari halaman PRD Saya. Untuk menghapus akun beserta
              seluruh datanya, hubungi kami.
            </p>
          </article>
        </main>
      </div>
    </div>
  );
}
