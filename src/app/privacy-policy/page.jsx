import Navbar from "@/app/components/Navbar";
import Link from "next/link";
export const metadata = {
  title: "Kebijakan Privasi | Lucratus Agency",
  description:
    "Pelajari bagaimana Lucratus Agency mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi serta bisnis Anda.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

const sections = [
  ["introduction", "01", "Pendahuluan"],
  ["information", "02", "Informasi yang Kami Kumpulkan"],
  ["usage", "03", "Penggunaan Informasi"],
  ["sharing", "04", "Pembagian Informasi"],
  ["cookies", "05", "Cookie dan Teknologi Pelacakan"],
  ["security", "06", "Penyimpanan dan Keamanan Data"],
  ["retention", "07", "Penyimpanan Data"],
  ["rights", "08", "Hak Privasi Anda"],
  ["third-party", "09", "Situs Pihak Ketiga"],
  ["children", "10", "Privasi Anak"],
  ["changes", "11", "Perubahan Kebijakan"],
  ["contact", "12", "Hubungi Kami"],
];

function Section({ id, number, title, children }) {
  return (
    <section
      id={id}
      className="scroll-mt-28 border-b border-white/[0.08] py-9 last:border-b-0"
    >
      <div className="flex items-start gap-4">
        <span className="pt-1 text-xs font-medium tracking-wider text-[#77777E]">
          {number}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
            {title}
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-[#A5A5AA] sm:text-base">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

function BulletList({ items }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-[#77777E]">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

const emailLink =
  "mailto:agencylucratus@gmail.com?subject=Pertanyaan%20Privasi";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white selection:bg-white selection:text-black">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.08] pt-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.07),transparent_55%)]"
        />

        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-12 lg:py-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#B8B8BE]">
            <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
            Legal & Privasi
          </div>

          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            Kebijakan
            <span className="text-[#77777E]"> Privasi.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[#A5A5AA] sm:text-lg sm:leading-8">
            Kami menghargai kepercayaan Anda. Pelajari bagaimana Lucratus Agency
            menangani informasi pribadi dan bisnis yang Anda bagikan kepada
            kami.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-[#85858C]">
            <span>Lucratus Agency</span>
            <span className="text-white/20">/</span>
            <span>Terakhir diperbarui: 13 Oktober 2026</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-12 sm:py-16 lg:grid-cols-[250px_minmax(0,760px)] lg:gap-20 lg:px-12 lg:py-20">
        {/* Table of contents */}
        <aside className="self-start lg:sticky lg:top-8">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#77777E]">
            Daftar Isi
          </p>

          <nav aria-label="Daftar bagian kebijakan privasi">
            <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-1">
              {sections.map(([id, number, title]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="block rounded-lg px-3 py-2 text-xs leading-5 text-[#9999A0] transition hover:bg-white/[0.05] hover:text-white"
                  >
                    <span className="mr-2 text-[#66666D]">{number}</span>
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-8 hidden rounded-xl border border-white/[0.08] bg-[#171719] p-4 lg:block">
            <p className="text-xs font-medium text-white">
              Pertanyaan tentang data Anda?
            </p>
            <p className="mt-2 text-xs leading-5 text-[#9999A0]">
              Hubungi tim kami untuk pertanyaan atau permintaan terkait privasi.
            </p>
            <a
              href={emailLink}
              className="mt-3 inline-flex text-xs font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
            >
              Hubungi Lucratus ↗
            </a>
          </div>
        </aside>

        {/* Policy */}
        <article className="min-w-0">
          <div className="rounded-xl border border-white/[0.08] bg-[#171719] p-5 sm:p-6">
            <p className="text-sm leading-7 text-[#B8B8BE]">
              Kebijakan ini menjelaskan bagaimana kami mengumpulkan,
              menggunakan, menyimpan, dan melindungi informasi ketika Anda
              mengunjungi website, mengisi Growth Audit, menghubungi tim kami,
              atau menggunakan layanan Lucratus Agency.
            </p>
          </div>

          <Section id="introduction" number="01" title="Pendahuluan">
            <p>
              Lucratus Agency (&quot;Lucratus&quot;, &quot;kami&quot;)
              menghargai privasi Anda dan berkomitmen untuk menangani informasi
              pribadi secara bertanggung jawab.
            </p>
            <p>
              Kebijakan ini menjelaskan praktik pengelolaan data kami serta
              pilihan yang tersedia bagi Anda. Jika hukum yang berlaku
              mewajibkan persetujuan untuk pemrosesan tertentu, kami akan
              meminta persetujuan tersebut secara terpisah.
            </p>
          </Section>

          <Section
            id="information"
            number="02"
            title="Informasi yang Kami Kumpulkan"
          >
            <p>
              Jenis informasi yang kami kumpulkan bergantung pada cara Anda
              berinteraksi dengan website dan layanan kami.
            </p>

            <h3 className="font-medium text-white">
              Informasi pribadi dan kontak
            </h3>
            <BulletList
              items={[
                "Nama dan nama bisnis atau perusahaan.",
                "Alamat email dan nomor WhatsApp.",
                "Alamat website dan tautan media sosial jika diberikan.",
              ]}
            />

            <h3 className="font-medium text-white">
              Informasi bisnis dan Growth Audit
            </h3>
            <BulletList
              items={[
                "Jenis bisnis, produk atau layanan, serta harga jual rata-rata.",
                "Saluran pemasaran, aktivitas iklan, dan metode konversi yang digunakan.",
                "Informasi omzet, pengeluaran iklan, dan anggaran yang Anda berikan.",
                "Kendala bisnis, tujuan pertumbuhan, kapasitas investasi, dan kebutuhan layanan.",
              ]}
            />

            <h3 className="font-medium text-white">Informasi teknis</h3>
            <p>
              Bergantung pada konfigurasi website dan teknologi yang digunakan,
              kami dapat mengumpulkan informasi teknis seperti alamat IP, jenis
              browser, perangkat, halaman yang dikunjungi, sumber kunjungan, dan
              interaksi Anda dengan website.
            </p>
            <p>
              Jangan mengirimkan kata sandi, detail kartu pembayaran, atau
              informasi pribadi sensitif melalui formulir Growth Audit, kecuali
              diminta secara khusus melalui proses yang sesuai dan aman.
            </p>
          </Section>

          <Section id="usage" number="03" title="Penggunaan Informasi">
            <p>Kami dapat menggunakan informasi Anda untuk:</p>
            <BulletList
              items={[
                "Meninjau Growth Audit dan memahami kebutuhan bisnis Anda.",
                "Menilai kesesuaian bisnis Anda dengan layanan pemasaran dan pertumbuhan kami.",
                "Menghubungi Anda terkait hasil audit, pertanyaan, atau potensi kerja sama.",
                "Menjadwalkan konsultasi dan membahas strategi pemasaran.",
                "Menyediakan, mengelola, dan meningkatkan layanan yang Anda minta.",
                "Mengevaluasi performa website dan aktivitas pemasaran jika relevan.",
                "Menjaga keamanan website, mencegah penyalahgunaan, serta memenuhi kewajiban hukum.",
              ]}
            />
            <p>
              Pengisian Growth Audit tidak menjamin konsultasi, penawaran
              layanan, hasil bisnis tertentu, atau kerja sama dengan Lucratus.
            </p>
          </Section>

          <Section id="sharing" number="04" title="Pembagian Informasi">
            <p>
              Kami tidak menjual informasi pribadi Anda. Kami dapat membagikan
              informasi kepada pihak lain apabila diperlukan secara wajar untuk
              tujuan yang dijelaskan dalam kebijakan ini, termasuk:
            </p>
            <BulletList
              items={[
                "Penyedia hosting website, infrastruktur, database, dan penyimpanan cloud.",
                "Penyedia komunikasi, penjadwalan, dan pengelolaan hubungan pelanggan (CRM).",
                "Penyedia analitik atau periklanan apabila teknologi tersebut digunakan.",
                "Penasihat profesional atau pihak berwenang jika diwajibkan oleh hukum atau diperlukan untuk melindungi hak dan keamanan.",
              ]}
            />
            <p>
              Penyedia layanan dapat memproses informasi atas nama kami sesuai
              ketentuan yang berlaku dan perlindungan kontraktual yang relevan.
              Kami tidak mengizinkan penggunaan informasi untuk tujuan yang
              tidak berkaitan dengan layanan yang diberikan.
            </p>
          </Section>

          <Section
            id="cookies"
            number="05"
            title="Cookie dan Teknologi Pelacakan"
          >
            <p>
              Website kami dapat menggunakan cookie atau teknologi serupa untuk
              mendukung fungsi website, memahami penggunaan website, dan
              mengukur performa pemasaran.
            </p>
            <p>
              Teknologi yang digunakan bergantung pada alat yang benar-benar
              diaktifkan pada website. Jika layanan analitik atau periklanan
              pihak ketiga digunakan, penyedia tersebut dapat mengumpulkan
              informasi mengenai interaksi Anda sesuai kebijakan privasinya.
            </p>
            <p>
              Anda dapat mengelola cookie melalui pengaturan browser dan kontrol
              persetujuan yang tersedia pada website. Jika diwajibkan oleh
              hukum, kami akan meminta persetujuan sebelum menggunakan cookie
              atau teknologi pelacakan yang tidak esensial.
            </p>
          </Section>

          <Section
            id="security"
            number="06"
            title="Penyimpanan dan Keamanan Data"
          >
            <p>
              Kami menerapkan langkah teknis dan organisatoris yang wajar untuk
              membantu melindungi informasi pribadi dari akses, kehilangan,
              penyalahgunaan, perubahan, atau pengungkapan tanpa izin.
            </p>
            <p>
              Informasi dapat diproses atau disimpan oleh penyedia layanan kami.
              Bergantung pada infrastruktur penyedia, data dapat diproses di
              luar negara tempat Anda tinggal, dengan tetap memperhatikan
              persyaratan hukum yang berlaku.
            </p>
            <p>
              Tidak ada metode transmisi atau penyimpanan elektronik yang
              sepenuhnya aman. Karena itu, kami tidak dapat menjamin keamanan
              secara mutlak.
            </p>
          </Section>

          <Section id="retention" number="07" title="Penyimpanan Data">
            <p>
              Kami menyimpan informasi pribadi selama diperlukan secara wajar
              untuk tujuan dalam kebijakan ini, termasuk kualifikasi calon
              klien, komunikasi bisnis, penyediaan layanan, pencatatan, dan
              pemenuhan kewajiban hukum.
            </p>
            <p>
              Ketika informasi tidak lagi diperlukan, kami akan mengambil
              langkah yang wajar untuk menghapus atau menganonimkannya, dengan
              tetap memperhatikan kewajiban penyimpanan yang berlaku.
            </p>
          </Section>

          <Section id="rights" number="08" title="Hak Privasi Anda">
            <p>
              Sesuai hukum yang berlaku, Anda dapat memiliki hak untuk meminta
              akses ke informasi pribadi, memperbaiki data yang tidak akurat,
              meminta penghapusan data, menarik persetujuan jika pemrosesan
              didasarkan pada persetujuan, atau menggunakan hak lain yang
              tersedia berdasarkan peraturan perlindungan data.
            </p>
            <p>
              Untuk mengajukan permintaan, kirim email ke{" "}
              <a
                href={emailLink}
                className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
              >
                agencylucratus@gmail.com
              </a>
              . Kami mungkin perlu memverifikasi identitas Anda sebelum
              memproses permintaan dan dapat diwajibkan menyimpan informasi
              tertentu berdasarkan hukum.
            </p>
            <p>
              Kami berupaya menangani informasi pribadi sesuai ketentuan
              perlindungan data yang berlaku, termasuk Undang-Undang Nomor 27
              Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP), sepanjang
              berlaku bagi kegiatan pemrosesan kami.
            </p>
          </Section>

          <Section id="third-party" number="09" title="Situs Pihak Ketiga">
            <p>
              Website kami dapat memuat tautan ke website pihak ketiga, platform
              media sosial, atau layanan penjadwalan. Layanan tersebut memiliki
              kebijakan privasi masing-masing.
            </p>
            <p>
              Kami menyarankan Anda membaca kebijakan privasi mereka sebelum
              memberikan informasi secara langsung. Kami tidak mengendalikan
              praktik privasi website yang tidak kami kelola.
            </p>
          </Section>

          <Section id="children" number="10" title="Privasi Anak">
            <p>
              Website dan layanan kami ditujukan bagi pemilik bisnis serta
              individu yang mencari layanan profesional, bukan untuk anak-anak.
              Kami tidak secara sengaja mengumpulkan informasi pribadi anak
              dengan cara yang melanggar hukum yang berlaku.
            </p>
            <p>
              Jika Anda meyakini bahwa seorang anak telah memberikan informasi
              pribadi kepada kami, silakan hubungi kami agar kami dapat meninjau
              dan mengambil tindakan yang sesuai.
            </p>
          </Section>

          <Section id="changes" number="11" title="Perubahan Kebijakan">
            <p>
              Kami dapat memperbarui Kebijakan Privasi ini untuk mencerminkan
              perubahan layanan, praktik pengelolaan data, teknologi, atau
              persyaratan hukum.
            </p>
            <p>
              Versi terbaru akan diterbitkan pada halaman ini beserta tanggal
              pembaruannya. Penggunaan website selanjutnya tetap tunduk pada
              ketentuan yang diperbarui serta persyaratan persetujuan yang
              diwajibkan oleh hukum.
            </p>
          </Section>

          <Section id="contact" number="12" title="Hubungi Kami">
            <p>
              Jika Anda memiliki pertanyaan mengenai kebijakan ini atau ingin
              mengajukan permintaan terkait informasi pribadi, silakan hubungi
              kami:
            </p>

            <div className="rounded-xl border border-white/[0.1] bg-[#171719] p-5 sm:p-6">
              <p className="font-semibold text-white">Lucratus Agency</p>
              <p className="mt-2">Email: agencylucratus@gmail.com</p>
              <p>Lokasi: Indonesia</p>
              <a
                href={emailLink}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white hover:text-black"
              >
                Hubungi Tim Kami <span aria-hidden="true">↗</span>
              </a>
            </div>
          </Section>

          <div className="mt-8 border-t border-white/[0.08] pt-6">
            <Link
              href="/"
              className="text-sm text-[#A5A5AA] transition hover:text-white"
            >
              ← Kembali ke Lucratus Agency
            </Link>
          </div>
        </article>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-7 text-xs text-[#85858C] sm:flex-row sm:items-center sm:justify-between lg:px-12">
          <p>
            © {new Date().getFullYear()} Lucratus Agency. Hak cipta dilindungi.
          </p>

          <nav aria-label="Navigasi footer" className="flex flex-wrap gap-5">
            <Link href="/" className="transition hover:text-white">
              Beranda
            </Link>
            <Link
              href="/privacy-policy"
              className="text-white transition hover:text-white"
              aria-current="page"
            >
              Kebijakan Privasi
            </Link>
            <a href={emailLink} className="transition hover:text-white">
              Kontak
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
