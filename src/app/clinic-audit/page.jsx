"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CalendarDays,
  ShieldCheck,
  Stethoscope,
  UserRoundCheck,
  XCircle,
} from "lucide-react";

import MetaPixel, { trackMetaEvent } from "@/app/components/MetaPixel";

const CALENDLY_URL =
  "https://calendly.com/agencylucratus/discovery-call?hide_gdpr_banner=1";
const revenueOptions = [
  "Di bawah Rp500 juta",
  "Rp500 juta–Rp1 miliar",
  "Rp1–3 miliar",
  "Rp3–5 miliar",
  "Rp5–10 miliar",
  "Di atas Rp10 miliar",
  "Belum ingin menyebutkan",
];

const initialForm = {
  isClinicOwner: "",
  annualRevenue: "",
  clinicName: "",
  name: "",
  whatsapp: "",
  email: "",
  contactConsent: false,
};

function Field({ label, children, optional = false }) {
  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-gray-200">
        {label}
        {optional && (
          <span className="ml-2 text-xs font-normal text-gray-500">
            Opsional
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      autoComplete={autoComplete}
      className="w-full rounded-xl border border-white/10 bg-[#111113] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-white/30"
    />
  );
}

function Choice({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-4 text-left text-sm transition ${active ? "border-white/40 bg-white/10 text-white" : "border-white/10 bg-[#111113] text-gray-400 hover:border-white/20 hover:text-white"}`}
    >
      <span>{children}</span>
      {active && <Check size={16} className="shrink-0" />}
    </button>
  );
}

function isRevenueQualified(revenue) {
  return ["Rp3–5 miliar", "Rp5–10 miliar", "Di atas Rp10 miliar"].includes(
    revenue,
  );
}

function CalendlyEmbed() {
  const containerRef = useRef(null);

  useEffect(() => {
    const src = "https://assets.calendly.com/assets/external/widget.js";
    let cancelled = false;
    let script = document.querySelector(`script[src="${src}"]`);

    const initWidget = () => {
      if (
        cancelled ||
        !containerRef.current ||
        !window.Calendly?.initInlineWidget
      ) {
        return;
      }

      containerRef.current.innerHTML = "";

      window.Calendly.initInlineWidget({
        url: CALENDLY_URL,
        parentElement: containerRef.current,
      });

      console.log("[Calendly] Inline widget initialized");
    };

    if (window.Calendly?.initInlineWidget) {
      initWidget();
    } else if (script) {
      script.addEventListener("load", initWidget, { once: true });
    } else {
      script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.addEventListener("load", initWidget, { once: true });
      script.addEventListener(
        "error",
        () => console.error("[Calendly] Widget script failed to load"),
        { once: true },
      );
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;
      script?.removeEventListener("load", initWidget);
    };
  }, []);

  return (
    <div
      className="
        relative left-1/2 w-screen -translate-x-1/2
        overflow-hidden
        md:static md:w-full md:translate-x-0
      "
    >
      <div
        ref={containerRef}
        className="calendly-mobile-container w-full overflow-hidden md:rounded-xl"
        style={{
          minWidth: "320px",
          width: "100%",
          height: "760px",
        }}
        aria-label="Pilih jadwal Clinic Growth Call"
      />
    </div>
  );
}

function trackMetaLead() {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;

  window.fbq("track", "Lead", {
    content_name: "Clinic Growth Assessment",
    content_category: "Clinic",
  });
}

export default function ClinicAuditPage() {
  const [form, setForm] = useState(initialForm);
  const [stage, setStage] = useState("owner"); // owner | revenue | contact | result | disqualified | error
  const [qualified, setQualified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [auditId, setAuditId] = useState("");

  const update = (field, value) =>
    setForm((previous) => ({ ...previous, [field]: value }));

  function nextFromOwner() {
    if (!form.isClinicOwner) return;
    if (form.isClinicOwner === "Tidak") {
      setStage("disqualified");
      return;
    }
    setStage("revenue");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function nextFromRevenue() {
    if (!form.annualRevenue) return;
    setStage("contact");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    if (!isContactValid || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const getCookie = (name) => {
        const prefix = `${name}=`;
        const item = document.cookie
          .split("; ")
          .find((cookie) => cookie.startsWith(prefix));

        return item ? decodeURIComponent(item.slice(prefix.length)) : "";
      };

      const response = await fetch("/api/clinic-audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          form,
          fbp: getCookie("_fbp"),
          fbc: getCookie("_fbc"),
        }),
      });

      const result = await response.json();

      console.log("[ClinicAudit] API response:", {
        status: response.status,
        ok: response.ok,
        auditId: result.auditId,
        qualified: result.qualified,
        eventId: result.eventId,
      });

      if (!response.ok) {
        console.error("[ClinicAudit] Form gagal dikirim:", result.error);
        throw new Error(result.error || "Form gagal dikirim.");
      }

      console.log("[ClinicAudit] Form berhasil diterima API");

      // Deduplikasi: ID ini sama dengan event_id yang dikirim melalui CAPI.
      // Kirim event Lead dari browser
      const pixelSent = trackMetaEvent("Lead", result.eventId, {
        content_name: "Clinic Growth Assessment",
        content_category: "Clinic",
      });

      console.log("[ClinicAudit] Browser Meta Pixel:", {
        event: "Lead",
        eventId: result.eventId,
        functionExecuted: pixelSent,
      });

      setAuditId(result.auditId);
      setQualified(result.qualified);
      setStage("result");

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      console.error("[ClinicAudit] submit failed", e);
      setError(
        e.message || "Form belum berhasil dikirim. Silakan coba kembali.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const isContactValid = Boolean(
    form.clinicName.trim() &&
    form.name.trim() &&
    form.whatsapp.trim() &&
    form.email.trim() &&
    form.contactConsent,
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0D0D0D] text-white">
      <MetaPixel />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,#202024_0%,#0D0D0D_45%,#0D0D0D_100%)]" />
      <header className="relative z-10 border-b border-white/[0.07] bg-[#0D0D0D]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Lucratus
          </Link>
          <span className="text-xs uppercase tracking-[0.18em] text-gray-500">
            Clinic Growth Review
          </span>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-12 md:py-16">
        {stage !== "result" && stage !== "disqualified" && (
          <div className="mb-10">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-white/30" />
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                CLINIC GROWTH ASSESSMENT
              </p>
            </div>
            <h1 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-6xl">
              Lebih Banyak Peluang Booking.
              <span className="text-gray-500">
                {" "}
                Akuisisi Pasien yang Terukur.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">
              Temukan peluang untuk meningkatkan akuisisi pasien dan booking
              konsultasi melalui sistem pemasaran yang lebih terstruktur. Jawab
              beberapa pertanyaan singkat untuk mengetahui apakah pendekatan
              Lucratus sesuai dengan kebutuhan klinik Anda.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                <Stethoscope size={18} className="text-gray-300" />
                <p className="mt-3 text-sm font-medium">Khusus klinik</p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Fokus pada akuisisi dan booking konsultasi.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                <UserRoundCheck size={18} className="text-gray-300" />
                <p className="mt-3 text-sm font-medium">Singkat & relevan</p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Pertanyaan utama berbentuk pilihan.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                <CalendarDays size={18} className="text-gray-300" />
                <p className="mt-3 text-sm font-medium">Langkah berikutnya</p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Klinik yang sesuai dapat memilih jadwal call.
                </p>
              </div>
            </div>
          </div>
        )}

        {stage === "owner" && (
          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Pertanyaan 1 dari 3
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
              Apakah Anda pemilik klinik?
            </h2>
            <p className="mt-3 text-sm leading-7 text-gray-400">
              Kami bekerja langsung dengan pemilik klinik atau pengambil
              keputusan utama.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {["Ya", "Tidak"].map((option) => (
                <Choice
                  key={option}
                  active={form.isClinicOwner === option}
                  onClick={() => update("isClinicOwner", option)}
                >
                  {option === "Ya" ? "Ya, saya pemilik klinik" : "Tidak"}
                </Choice>
              ))}
            </div>
            <div className="mt-9 flex justify-end border-t border-white/[0.08] pt-6">
              <button
                type="button"
                onClick={nextFromOwner}
                disabled={!form.isClinicOwner}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Lanjutkan <ArrowRight size={16} />
              </button>
            </div>
          </section>
        )}

        {stage === "revenue" && (
          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Pertanyaan 2 dari 3
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
              Berapa omzet klinik Anda dalam 12 bulan terakhir?
            </h2>
            <p className="mt-3 text-sm leading-7 text-gray-400">
              Pilih perkiraan omzet total klinik selama setahun terakhir.
              Informasi ini membantu menilai kecocokan awal layanan.
            </p>
            <div className="mt-7 grid gap-3">
              {revenueOptions.map((option) => (
                <Choice
                  key={option}
                  active={form.annualRevenue === option}
                  onClick={() => update("annualRevenue", option)}
                >
                  {option}
                </Choice>
              ))}
            </div>
            <div className="mt-9 flex items-center justify-between border-t border-white/[0.08] pt-6">
              <button
                type="button"
                onClick={() => setStage("owner")}
                className="rounded-full px-4 py-2.5 text-sm text-gray-400 hover:text-white"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={nextFromRevenue}
                disabled={!form.annualRevenue}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Lanjutkan <ArrowRight size={16} />
              </button>
            </div>
          </section>
        )}

        {stage === "contact" && (
          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Pertanyaan 3 dari 3
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
              Ke mana kami dapat mengirim langkah berikutnya?
            </h2>
            <p className="mt-3 text-sm leading-7 text-gray-400">
              Isi kontak bisnis Anda. Jika memenuhi kriteria awal, Anda dapat
              langsung memilih jadwal Clinic Growth Call.
            </p>
            <div className="mt-8 space-y-6">
              <Field label="Nama klinik">
                <TextInput
                  value={form.clinicName}
                  onChange={(v) => update("clinicName", v)}
                  placeholder="Nama klinik"
                  autoComplete="organization"
                />
              </Field>
              <Field label="Nama lengkap">
                <TextInput
                  value={form.name}
                  onChange={(v) => update("name", v)}
                  placeholder="Nama Anda"
                  autoComplete="name"
                />
              </Field>
              <Field label="Nomor WhatsApp">
                <TextInput
                  value={form.whatsapp}
                  onChange={(v) => update("whatsapp", v)}
                  placeholder="Contoh: 08123456789"
                  type="tel"
                  autoComplete="tel"
                />
              </Field>
              <Field label="Email bisnis">
                <TextInput
                  value={form.email}
                  onChange={(v) => update("email", v)}
                  placeholder="nama@klinik.com"
                  type="email"
                  autoComplete="email"
                />
              </Field>
              <label className="flex items-start gap-3 text-sm leading-6 text-gray-400">
                <input
                  type="checkbox"
                  checked={form.contactConsent}
                  onChange={(e) => update("contactConsent", e.target.checked)}
                  className="mt-1 accent-white"
                />
                <span>
                  Saya setuju dihubungi Lucratus melalui informasi kontak di
                  atas mengenai hasil penyaringan dan layanan yang relevan.
                </span>
              </label>
            </div>
            {error && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300"
              >
                {error}
              </div>
            )}
            <div className="mt-9 flex items-center justify-between border-t border-white/[0.08] pt-6">
              <button
                type="button"
                onClick={() => setStage("revenue")}
                disabled={submitting}
                className="rounded-full px-4 py-2.5 text-sm text-gray-400 hover:text-white disabled:opacity-30"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={!isContactValid || submitting}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {submitting ? "Memproses..." : "Evaluasi Klinik Saya"}
                {!submitting && <ArrowRight size={16} />}
              </button>
            </div>
            <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-gray-600">
              <ShieldCheck size={14} className="mt-0.5 shrink-0" />
              Jangan kirim data identitas, rekam medis, atau informasi kesehatan
              pasien melalui form ini.
            </p>
          </section>
        )}

        {stage === "disqualified" && (
          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-7 md:p-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5">
              <XCircle size={22} />
            </div>
            <p className="mt-7 text-xs uppercase tracking-[0.2em] text-gray-500">
              Clinic Growth Review
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Terima kasih atas ketertarikan Anda.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-400">
              Untuk saat ini, proses ini ditujukan khusus bagi pemilik klinik.
              Karena Anda memilih “Tidak”, form dihentikan dan sesi booking
              tidak ditampilkan.
            </p>
            <Link
              href="/"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/5"
            >
              Kembali ke Lucratus <ArrowRight size={16} />
            </Link>
          </section>
        )}

        {stage === "result" && (
          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 md:p-10">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5">
                <Check size={22} />
              </div>
              <p className="mt-7 text-xs uppercase tracking-[0.2em] text-gray-500">
                Clinic Growth Review
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
                {qualified
                  ? "Mari Bangun Sistem Akuisisi Pasien untuk Klinik Anda."
                  : "Mari Persiapkan Langkah Pertumbuhan Klinik Anda."}
              </h1>

              <p className="mt-5 text-sm leading-7 text-gray-400">
                {qualified
                  ? "Berdasarkan jawaban Anda, klinik Anda memenuhi kriteria awal untuk berdiskusi dengan Lucratus. Dalam sesi Clinic Growth Call, kita akan membahas peluang akuisisi pasien, proses booking konsultasi, serta langkah optimasi yang paling relevan dengan kebutuhan klinik Anda. Pilih jadwal yang sesuai untuk memulai diskusi."
                  : "Berdasarkan informasi yang Anda berikan, klinik Anda belum memenuhi kriteria awal untuk sesi strategi Lucratus saat ini. Anda tetap dapat mengikuti insight Lucratus untuk mempelajari strategi akuisisi pasien dan meningkatkan proses booking konsultasi."}
              </p>
            </div>

            {qualified ? (
              <div className="mt-9">
                <div className="mb-5 flex items-center gap-3">
                  <CalendarDays size={18} className="text-gray-300" />
                  <div>
                    <h2 className="text-lg font-semibold">
                      Jadwalkan Clinic Growth Call Anda
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Diskusikan peluang pertumbuhan dan langkah berikutnya
                      bersama Lucratus.
                    </p>
                  </div>
                </div>
                <div className="mb-6 rounded-xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm font-medium">
                    Apa yang akan kita bahas?
                  </p>

                  <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-400">
                    <li className="flex gap-3">
                      <Check size={16} className="mt-1 shrink-0 text-white" />
                      Peluang mendapatkan calon pasien yang relevan.
                    </li>
                    <li className="flex gap-3">
                      <Check size={16} className="mt-1 shrink-0 text-white" />
                      Hambatan antara iklan, follow-up, dan booking konsultasi.
                    </li>
                    <li className="flex gap-3">
                      <Check size={16} className="mt-1 shrink-0 text-white" />
                      Prioritas optimasi berdasarkan kondisi klinik Anda.
                    </li>
                  </ul>
                </div>
                <CalendlyEmbed />
                <p className="mt-4 text-xs leading-5 text-gray-600">
                  Audit ID: {auditId}. Sesi ini adalah diskusi awal, bukan
                  jaminan jumlah pasien atau hasil finansial.
                </p>
              </div>
            ) : (
              <div className="mt-8 rounded-xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm font-medium">Langkah berikutnya</p>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Fokuskan dahulu pada pertumbuhan dan pencatatan performa
                  klinik. Anda dapat mengikuti insight Lucratus untuk memahami
                  sistem akuisisi dan booking.
                </p>
                <a
                  href="https://www.instagram.com/lucratusagency/"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold hover:bg-white/5"
                >
                  Lihat insight Lucratus <ArrowRight size={15} />
                </a>
              </div>
            )}
          </section>
        )}

        {stage !== "result" && stage !== "disqualified" && (
          <p className="mt-6 text-center text-xs leading-5 text-gray-600">
            Penyaringan awal ini membantu menentukan kecocokan diskusi. Hasil
            pemasaran tidak dijamin dan bergantung pada banyak faktor, termasuk
            layanan, kapasitas tim, dan proses follow-up klinik.
          </p>
        )}
      </div>
    </main>
  );
}
