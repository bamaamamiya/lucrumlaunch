"use client";
// growth-audit/page.jsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
} from "lucide-react";
import {
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

import { generateAudit } from "@/lib/audit/engine";
import { db } from "../../lib/firebase";

const steps = [
  "Bisnis",
  "Akuisisi",
  "Ekonomi",
  "Bottleneck",
  "Investasi",
  "Kontak",
];
const AUDIT_STORAGE_KEY = "lucratus-growth-audit";

const initialForm = {
  businessType: "",
  brandName: "",
  product: "",
  averagePrice: "",

  currentlyRunningAds: "",
  acquisitionChannel: "",
  conversionMethod: "",

  monthlyRevenue: "",
  monthlyAdSpend: "",
  dailyAdBudget: "",

  biggestBottleneck: [],
  goal: "",

  investment: "",

  name: "",
  whatsapp: "",
  email: "",
  socialProfile: "",
};

export default function GrowthAuditPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [hydrated, setHydrated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let restoredStep = 0;
    let restoredForm = { ...initialForm };

    try {
      const saved = localStorage.getItem(AUDIT_STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (typeof parsed.step === "number") {
          restoredStep = Math.min(Math.max(parsed.step, 0), steps.length - 1);
        }

        if (parsed.form) {
          restoredForm = {
            ...initialForm,
            ...parsed.form,
          };
        }
      }
    } catch (error) {
      console.error("Failed to restore growth audit:", error);
    }

    // Current entry = Step 0
    window.history.replaceState(
      {
        auditStep: 0,
      },
      "",
      window.location.pathname,
    );

    // Reconstruct history sampai step terakhir
    for (let i = 1; i <= restoredStep; i++) {
      window.history.pushState(
        {
          auditStep: i,
        },
        "",
        window.location.pathname,
      );
    }

    setStep(restoredStep);
    setForm(restoredForm);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const { name, whatsapp, email, socialProfile, ...draftForm } = form;

    localStorage.setItem(
      AUDIT_STORAGE_KEY,
      JSON.stringify({
        step,
        form: draftForm,
      }),
    );
  }, [step, form, hydrated]);

  useEffect(() => {
    const handlePopState = (event) => {
      const auditStep = event.state?.auditStep;

      // Kalau history entry ini milik Growth Audit
      if (typeof auditStep === "number") {
        setStep(auditStep);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleBottleneck = (value) => {
    setForm((prev) => {
      const exists = prev.biggestBottleneck.includes(value);

      if (exists) {
        return {
          ...prev,
          biggestBottleneck: prev.biggestBottleneck.filter(
            (item) => item !== value,
          ),
        };
      }

      if (prev.biggestBottleneck.length >= 2) {
        return prev;
      }

      return {
        ...prev,
        biggestBottleneck: [...prev.biggestBottleneck, value],
      };
    });
  };

  const canContinue = () => {
    switch (step) {
      case 0:
        return Boolean(
          form.brandName &&
          form.businessType &&
          form.product &&
          form.averagePrice,
        );

      case 1:
        return Boolean(
          form.currentlyRunningAds &&
          form.acquisitionChannel &&
          form.conversionMethod,
        );

      case 2:
        return Boolean(form.monthlyRevenue && form.monthlyAdSpend);

      case 3:
        return Boolean(form.biggestBottleneck.length > 0 && form.goal);

      case 4:
        return Boolean(form.investment);

      case 5:
        return Boolean(form.name && form.whatsapp && form.email);

      default:
        return false;
    }
  };

  const calculateQualification = (form) => {
    let score = 0;
    let tier = "not_fit";

    // Business fit
    const goodBusinessTypes = [
      "E-commerce",
      "Bisnis Lokal",
      "Klinik / Healthcare",
      "Jasa Profesional",
      "Edukasi / Kursus",
      "B2B",
      "SaaS / Teknologi",
    ];

    if (goodBusinessTypes.includes(form.businessType)) {
      score += 2;
    }

    // Revenue
    const revenueScore = {
      "< Rp10jt": 0,
      "Rp10–25jt": 1,
      "Rp25–50jt": 2,
      "Rp50–100jt": 3,
      "Rp100–250jt": 3,
      "Rp250jt+": 3,
      "Tidak ingin menyebutkan": 0,
    };

    score += revenueScore[form.monthlyRevenue] ?? 0;

    // Current ads / acquisition
    if (form.currentlyRunningAds === "Ya") {
      score += 2;
    } else if (form.currentlyRunningAds === "Pernah") {
      score += 1;
    }

    // Investment readiness
    const investmentScore = {
      "< Rp1jt": 0,
      "Rp1–3jt": 1,
      "Rp3–5jt": 2,
      "Rp5–10jt": 3,
      "> Rp10jt": 3,
      "Saya belum tahu, saya ingin melihat rekomendasinya terlebih dahulu": 0,
    };

    score += investmentScore[form.investment] ?? 0;

    // Has meaningful growth goal
    if (form.goal?.trim()) {
      score += 1;
    }

    if (score >= 7) {
      tier = "qualified";
    } else if (score >= 4) {
      tier = "nurture";
    }

    return {
      score,
      qualified: tier === "qualified",
      tier,
    };
  };

  const submitAudit = async () => {
    if (!canContinue() || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      console.log("[GrowthAudit] 1. Submit started");

      // =========================================
      // 1. GENERATE DIAGNOSIS
      // =========================================

      const auditResult = generateAudit(form);

      console.log("[GrowthAudit] 2. Audit generated", auditResult);

      const qualification = calculateQualification(form);

      console.log("[GrowthAudit] 3. Qualification calculated", qualification);

      // =========================================
      // 2. GENERATE DOCUMENT ID LOCALLY
      // =========================================

      const auditRef = doc(collection(db, "growthAudits"));
      const resultRef = doc(db, "auditResults", auditRef.id);

      console.log("[GrowthAudit] 4. Generated audit ID:", auditRef.id);

      // =========================================
      // 3. PREPARE LEAD DATA
      // =========================================

      const auditData = {
        ...form,

        auditScore: auditResult.auditScore,
        businessStage: auditResult.businessStage,
        acquisitionStatus: auditResult.acquisitionStatus,
        primaryBottleneck: auditResult.primaryBottleneck,
        readiness: auditResult.readiness,
        recommendations: auditResult.recommendations,

        qualificationScore: qualification.score,
        qualificationTier: qualification.tier,
        qualified: qualification.qualified,

        // CRM lifecycle
        salesStage: "new",

        contactStatus: "not_contacted",
        lastContactedAt: null,
        nextFollowUpAt: null,

        proposalSentAt: null,
        wonAt: null,
        lostAt: null,

        callBookedAt: null,
        callCompletedAt: null,

        source: "website",
        formVersion: "v1",

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // =========================================
      // 4. PREPARE PUBLIC RESULT
      // =========================================

      const resultData = {
        auditScore: auditResult.auditScore,
        businessStage: auditResult.businessStage,
        acquisitionStatus: auditResult.acquisitionStatus,
        primaryBottleneck: auditResult.primaryBottleneck,
        readiness: auditResult.readiness,
        recommendations: auditResult.recommendations,

        qualificationScore: qualification.score,
        qualified: qualification.qualified,
        qualificationTier: qualification.tier,

        auditId: auditRef.id,

        createdAt: serverTimestamp(),

        formVersion: "v1",
      };

      // =========================================
      // 5. ATOMIC FIRESTORE WRITE
      // =========================================

      console.log("[GrowthAudit] 5. Preparing Firestore batch...");

      const batch = writeBatch(db);

      batch.set(auditRef, auditData);
      batch.set(resultRef, resultData);

      console.log("[GrowthAudit] 6. Committing Firestore batch...");

      // =========================================
      // 6. TIMEOUT PROTECTION
      // =========================================

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(
            new Error("Koneksi ke database terlalu lama. Silakan coba lagi."),
          );
        }, 15000);
      });

      await Promise.race([batch.commit(), timeoutPromise]);

      console.log("[GrowthAudit] 7. Firestore batch committed:", auditRef.id);

      // =========================================
      // 7. CLEANUP
      // =========================================

      localStorage.removeItem(AUDIT_STORAGE_KEY);

      console.log("[GrowthAudit] 8. Redirecting...");

      router.push(`/growth-audit/result/${auditRef.id}`);
    } catch (err) {
      console.error("[GrowthAudit] SUBMIT ERROR:", err);
      console.error("[GrowthAudit] ERROR CODE:", err?.code);
      console.error("[GrowthAudit] ERROR MESSAGE:", err?.message);

      setError(
        err?.message ||
          "Terjadi masalah saat mengirim diagnosis. Silakan coba lagi.",
      );

      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (!canContinue() || submitting) return;

    // Last step → submit audit
    if (step === steps.length - 1) {
      submitAudit();
      return;
    }

    const nextStepIndex = step + 1;

    window.history.pushState(
      {
        auditStep: nextStepIndex,
      },
      "",
      window.location.pathname,
    );

    setStep(nextStepIndex);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const previousStep = () => {
    if (step > 0) {
      window.history.back();
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0D0D0D] text-white">
      {/* BACKGROUND */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,#18181A_0%,#0D0D0D_42%,#0D0D0D_100%)]" />

        <div className="absolute left-1/2 top-[-250px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-white/[0.018] blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 70%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, transparent 70%)",
          }}
        />
      </div>

      {/* HEADER */}

      <header className="relative z-20 border-b border-white/[0.06] bg-[#0D0D0D]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-lg font-semibold tracking-[-0.03em]">
            Lucratus
          </Link>

          <span className="text-xs uppercase tracking-[0.18em] text-gray-600">
            Growth Diagnosis
          </span>
        </div>
      </header>

      {/* CONTENT */}

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-16 md:py-24">
        {/* INTRO */}

        <div className="mb-12">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-white/30" />

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
              Free Growth Diagnosis
            </p>
          </div>

          <h1 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-6xl">
            Mari pahami
            <span className="text-gray-500"> growth Anda.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">
            Jawab beberapa pertanyaan tentang bisnis, pemasaran, dan kondisi
            finansial Anda. Kami akan menggunakan informasi ini untuk memahami
            hambatan dan peluang pertumbuhan yang paling relevan.
          </p>
        </div>

        {/* PROGRESS */}

        <div className="mb-10">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">
              Langkah {step + 1} dari {steps.length}
            </span>

            <span className="text-xs text-gray-600">{steps[step]}</span>
          </div>

          <div className="h-px w-full bg-white/[0.08]">
            <div
              className="h-px bg-white transition-all duration-500"
              style={{
                width: `${((step + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* FORM CARD */}

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl md:p-10">
          {step === 0 && <BusinessStep form={form} updateField={updateField} />}

          {step === 1 && (
            <AcquisitionStep form={form} updateField={updateField} />
          )}

          {step === 2 && (
            <EconomicsStep form={form} updateField={updateField} />
          )}

          {step === 3 && (
            <BottleneckStep
              form={form}
              updateField={updateField}
              toggleBottleneck={toggleBottleneck}
            />
          )}

          {step === 4 && (
            <InvestmentStep form={form} updateField={updateField} />
          )}

          {step === 5 && <ContactStep form={form} updateField={updateField} />}

          {/* ERROR */}

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/[0.05] px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* NAVIGATION */}

          <div className="mt-10 flex items-center justify-between border-t border-white/[0.07] pt-6">
            <button
              type="button"
              onClick={previousStep}
              disabled={step === 0 || submitting}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-gray-500 transition-all hover:bg-white/[0.04] hover:text-white disabled:pointer-events-none disabled:opacity-20"
            >
              <ArrowLeft size={15} />
              Kembali
            </button>

            <button
              type="button"
              onClick={nextStep}
              disabled={!canContinue() || submitting}
              className={`
      inline-flex items-center justify-center gap-2 rounded-full
      px-5 py-3 text-sm font-semibold
      transition-all duration-300
      ${
        step === steps.length - 1
          ? "bg-white text-black shadow-[0_8px_30px_rgba(255,255,255,0.08)] hover:bg-gray-200 hover:shadow-[0_8px_35px_rgba(255,255,255,0.12)]"
          : "bg-white text-black hover:bg-gray-200"
      }
      disabled:cursor-not-allowed disabled:opacity-30
    `}
            >
              {submitting ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                  Menganalisis...
                </>
              ) : (
                <>
                  {step === steps.length - 1
                    ? "Lihat Hasil Diagnosis"
                    : "Lanjutkan"}

                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>
          </div>
        </div>

        {/* NOTE */}

        <div className="mt-6 flex items-start gap-3 text-xs leading-6 text-gray-600">
          <CircleHelp size={15} className="mt-0.5 shrink-0" />

          <p>
            Growth Diagnosis ini membantu Anda mendapatkan perspektif yang lebih
            jelas mengenai kondisi bisnis saat ini, area yang menjadi
            bottleneck, serta prioritas yang dapat Anda fokuskan untuk langkah
            berikutnya.
          </p>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   SHARED UI
========================================================= */

function FieldLabel({ children, optional = false }) {
  return (
    <label className="mb-3 block text-sm font-medium text-gray-200">
      {children}

      {optional && (
        <span className="ml-2 text-xs font-normal text-gray-600">Opsional</span>
      )}
    </label>
  );
}

function SelectField({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-white/[0.08] bg-[#111113] px-4 py-3.5 pr-10 text-sm text-white outline-none transition-colors focus:border-white/[0.2]"
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
      />
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-white/[0.08] bg-[#111113] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-700 transition-colors focus:border-white/[0.2]"
    />
  );
}

function OptionButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-3.5 text-left text-sm transition-all ${
        active
          ? "border-white/30 bg-white/[0.1] text-white"
          : "border-white/[0.08] bg-[#111113] text-gray-500 hover:border-white/[0.16] hover:text-gray-300"
      }`}
    >
      {children}
    </button>
  );
}

/* =========================================================
   STEP HEADING
========================================================= */

function StepHeading({ eyebrow, title, description }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-600">
        {eyebrow}
      </p>

      <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
        {title}
      </h2>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   BUSINESS
========================================================= */

function BusinessStep({ form, updateField }) {
  return (
    <div>
      <StepHeading
        eyebrow="01 / Bisnis"
        title="Ceritakan sedikit tentang bisnis Anda."
        description="Kami ingin memahami apa yang Anda jual dan siapa market yang sedang Anda layani."
      />

      <div className="mt-10 space-y-6">
        <div>
          <FieldLabel>Nama brand atau perusahaan</FieldLabel>

          <TextInput
            value={form.brandName}
            onChange={(value) => updateField("brandName", value)}
            placeholder="Contoh: ABC Dental Clinic / PT ABC Indonesia"
          />
        </div>

        <div>
          <FieldLabel>Jenis bisnis Anda</FieldLabel>

          <SelectField
            value={form.businessType}
            onChange={(value) => updateField("businessType", value)}
            placeholder="Pilih jenis bisnis"
            options={[
              "E-commerce",
              "Bisnis Lokal",
              "Klinik / Healthcare",
              "Jasa Profesional",
              "Edukasi / Kursus",
              "B2B",
              "SaaS / Teknologi",
              "Lainnya",
            ]}
          />
        </div>

        <div>
          <FieldLabel>Produk atau jasa yang Anda jual</FieldLabel>

          <TextInput
            value={form.product}
            onChange={(value) => updateField("product", value)}
            placeholder="Contoh: Skincare, jasa dental, consulting..."
          />
        </div>

        <div>
          <FieldLabel>Rata-rata harga produk atau jasa</FieldLabel>

          <TextInput
            value={form.averagePrice}
            onChange={(value) => updateField("averagePrice", value)}
            placeholder="Contoh: Rp500.000"
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ACQUISITION
========================================================= */

function AcquisitionStep({ form, updateField }) {
  return (
    <div>
      <StepHeading
        eyebrow="02 / Akuisisi"
        title="Bagaimana Anda mendapatkan customer saat ini?"
        description="Kami ingin memahami dari mana traffic datang dan apa yang terjadi setelah seseorang menunjukkan ketertarikan."
      />

      <div className="mt-10 space-y-6">
        <div>
          <FieldLabel>
            Apakah Anda sedang menjalankan iklan berbayar?
          </FieldLabel>

          <div className="grid gap-3 sm:grid-cols-3">
            {["Ya", "Tidak", "Pernah"].map((option) => (
              <OptionButton
                key={option}
                active={form.currentlyRunningAds === option}
                onClick={() => updateField("currentlyRunningAds", option)}
              >
                {option}
              </OptionButton>
            ))}
          </div>
        </div>

        <div>
          <FieldLabel>Sumber customer utama Anda saat ini</FieldLabel>

          <SelectField
            value={form.acquisitionChannel}
            onChange={(value) => updateField("acquisitionChannel", value)}
            placeholder="Pilih sumber utama"
            options={[
              "Meta Ads",
              "Google Ads",
              "TikTok Ads",
              "Media Sosial Organik",
              "WhatsApp",
              "Marketplace",
              "Referral",
              "Lainnya",
            ]}
          />
        </div>

        <div>
          <FieldLabel>
            Setelah calon customer tertarik, biasanya mereka diarahkan ke mana?
          </FieldLabel>

          <SelectField
            value={form.conversionMethod}
            onChange={(value) => updateField("conversionMethod", value)}
            placeholder="Pilih proses Anda"
            options={[
              "WhatsApp",
              "Website / Landing Page",
              "Telepon",
              "Appointment / Booking",
              "Checkout",
              "Tim Sales",
              "Lainnya",
            ]}
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ECONOMICS
========================================================= */

function EconomicsStep({ form, updateField }) {
  return (
    <div>
      <StepHeading
        eyebrow="03 / Ekonomi Bisnis"
        title="Sekarang kita lihat angkanya."
        description="Tidak perlu angka yang sempurna. Estimasi terbaik Anda sudah cukup untuk membantu kami memahami kondisi bisnis."
      />

      <div className="mt-10 space-y-6">
        <div>
          <FieldLabel>Rata-rata omzet per bulan</FieldLabel>

          <SelectField
            value={form.monthlyRevenue}
            onChange={(value) => updateField("monthlyRevenue", value)}
            placeholder="Pilih kisaran omzet"
            options={[
              "< Rp10jt",
              "Rp10–25jt",
              "Rp25–50jt",
              "Rp50–100jt",
              "Rp100–250jt",
              "Rp250jt+",
              "Tidak ingin menyebutkan",
            ]}
          />
        </div>

        <div>
          <FieldLabel>Rata-rata budget iklan per bulan</FieldLabel>

          <SelectField
            value={form.monthlyAdSpend}
            onChange={(value) => updateField("monthlyAdSpend", value)}
            placeholder="Pilih kisaran budget"
            options={[
              "Belum menjalankan iklan",
              "< Rp1jt",
              "Rp1–5jt",
              "Rp5–10jt",
              "Rp10–25jt",
              "Rp25–50jt",
              "Rp50jt+",
            ]}
          />
        </div>

        <div>
          <FieldLabel optional>Perkiraan budget iklan per hari</FieldLabel>

          <TextInput
            value={form.dailyAdBudget}
            onChange={(value) => updateField("dailyAdBudget", value)}
            placeholder="Contoh: Rp300.000/hari"
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   BOTTLENECK
========================================================= */

function BottleneckStep({ form, updateField, toggleBottleneck }) {
  const bottlenecks = [
    "Traffic / leads masih kurang",
    "Kualitas leads",
    "Conversion rate rendah",
    "Biaya mendapatkan customer terlalu tinggi",
    "Creative / materi iklan",
    "Landing page / funnel",
    "WhatsApp / proses sales",
    "Belum punya cukup data",
  ];

  return (
    <div>
      <StepHeading
        eyebrow="04 / Bottleneck"
        title="Menurut Anda, growth bisnis sedang terhambat di mana?"
        description="Pilih maksimal dua area yang paling menggambarkan kondisi bisnis Anda saat ini."
      />

      <div className="mt-10">
        <FieldLabel>Masalah marketing terbesar saat ini</FieldLabel>

        <div className="grid gap-3 sm:grid-cols-2">
          {bottlenecks.map((item) => {
            const active = form.biggestBottleneck.includes(item);

            return (
              <OptionButton
                key={item}
                active={active}
                onClick={() => toggleBottleneck(item)}
              >
                <div className="flex items-center justify-between gap-4">
                  <span>{item}</span>

                  {active && <Check size={16} />}
                </div>
              </OptionButton>
            );
          })}
        </div>

        <div className="mt-8">
          <FieldLabel>Apa target pertumbuhan yang ingin Anda capai?</FieldLabel>

          <TextInput
            value={form.goal}
            onChange={(value) => updateField("goal", value)}
            placeholder="Contoh: 2x omzet, 100 leads berkualitas/bulan..."
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INVESTMENT
========================================================= */

function InvestmentStep({ form, updateField }) {
  const options = [
    "< Rp1jt",
    "Rp1–3jt",
    "Rp3–5jt",
    "Rp5–10jt",
    "> Rp10jt",
    "Saya belum tahu, saya ingin melihat rekomendasinya terlebih dahulu",
  ];

  return (
    <div>
      <StepHeading
        eyebrow="05 / Investasi"
        title="Seberapa siap Anda berinvestasi untuk growth?"
        description="Jawaban ini membantu kami memahami apakah ada potential fit untuk partnership dan level implementasi yang masuk akal."
      />

      <div className="mt-10">
        <FieldLabel>
          Jika kami menemukan peluang pertumbuhan yang masuk akal untuk bisnis
          Anda, berapa investasi yang bersedia Anda siapkan untuk
          implementasinya?
        </FieldLabel>

        <div className="mt-4 grid gap-3">
          {options.map((option) => (
            <OptionButton
              key={option}
              active={form.investment === option}
              onClick={() => updateField("investment", option)}
            >
              {option}
            </OptionButton>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CONTACT
========================================================= */

function ContactStep({ form, updateField }) {
  return (
    <div>
      <StepHeading
        eyebrow="06 / Kontak"
        title="Ke mana kami bisa mengirim hasil audit Anda?"
        description="Gunakan kontak yang aktif. Hasil audit akan langsung ditampilkan setelah Anda mengirim form."
      />

      <div className="mt-10 space-y-6">
        <div>
          <FieldLabel>Nama Anda</FieldLabel>

          <TextInput
            value={form.name}
            onChange={(value) => updateField("name", value)}
            placeholder="Nama lengkap"
          />
        </div>

        <div>
          <FieldLabel>Nomor WhatsApp</FieldLabel>

          <TextInput
            value={form.whatsapp}
            onChange={(value) => updateField("whatsapp", value)}
            placeholder="Contoh: 08123456789"
            type="tel"
          />
        </div>

        <div>
          <FieldLabel>Email</FieldLabel>

          <TextInput
            value={form.email}
            onChange={(value) => updateField("email", value)}
            placeholder="nama@bisnis.com"
            type="email"
          />
        </div>

        <div>
          <FieldLabel optional>Instagram atau Facebook bisnis</FieldLabel>

          <TextInput
            value={form.socialProfile}
            onChange={(value) => updateField("socialProfile", value)}
            placeholder="Contoh: @namabrand atau facebook.com/namabrand"
          />
        </div>
      </div>
    </div>
  );
}
