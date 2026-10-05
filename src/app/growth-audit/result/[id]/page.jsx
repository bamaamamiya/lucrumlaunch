"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Gauge,
  Target,
  TrendingUp,
} from "lucide-react";

import { db } from "@/lib/firebase";

function SectionLabel({ children }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="h-px w-7 bg-white/30" />

      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
        {children}
      </p>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-gray-600">
            {label}
          </p>

          <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-white">
            {value}
          </h3>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-gray-400">
          <Icon
            size={17}
            strokeWidth={1.7}
          />
        </div>
      </div>

      {description && (
        <p className="mt-4 text-sm leading-6 text-gray-500">
          {description}
        </p>
      )}
    </div>
  );
}

function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0D0D0D] px-6 text-white">
      <div className="text-center">
        <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />

        <p className="mt-5 text-sm text-gray-500">
          Menganalisis growth Anda...
        </p>
      </div>
    </main>
  );
}

function ErrorScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0D0D0D] px-6 text-white">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03]">
          <CircleAlert
            size={22}
            className="text-gray-400"
          />
        </div>

        <h1 className="mt-7 text-2xl font-semibold">
          Audit tidak ditemukan.
        </h1>

        <p className="mt-4 text-sm leading-7 text-gray-500">
          Link audit mungkin sudah tidak valid atau
          data belum tersedia.
        </p>

        <Link
          href="/growth-audit"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
        >
          Mulai Growth Audit
          <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}

export default function GrowthAuditResultPage() {
  const params = useParams();

  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadAudit() {
      if (!params?.id) return;

      try {
        const snapshot = await getDoc(
          doc(
            db,
            "auditResults",
            params.id
          )
        );

        if (!snapshot.exists()) {
          setError(true);
          return;
        }

        setAudit({
          id: snapshot.id,
          ...snapshot.data(),
        });
      } catch (err) {
        console.error(
          "Growth Audit result error:",
          err
        );

        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadAudit();
  }, [params?.id]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !audit) {
    return <ErrorScreen />;
  }

  const businessStage =
    audit.businessStage;

  const acquisitionStatus =
    audit.acquisitionStatus;

  const bottleneck =
    audit.primaryBottleneck;

  const readiness =
    audit.readiness;

  const recommendations =
    audit.recommendations || [];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0D0D0D] text-white">
      {/* BACKGROUND */}

      <div
        className="pointer-events-none fixed inset-0"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-[-300px] h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-white/[0.018] blur-[150px]" />

        <div className="absolute inset-0 opacity-[0.018]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)
              `,
              backgroundSize: "48px 48px",
              maskImage:
                "linear-gradient(to bottom, black 0%, transparent 80%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, transparent 80%)",
            }}
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-24">
        {/* HEADER */}

        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <CheckCircle2
              size={15}
              className="text-gray-400"
            />

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
              Your Growth Audit
            </p>
          </div>

          <h1 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-6xl">
            Here's what we found
            <span className="text-gray-500">
              {" "}
              about your growth.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">
            Berdasarkan informasi yang Anda
            berikan, berikut adalah diagnosis awal
            mengenai acquisition dan growth bisnis
            Anda.
          </p>
        </div>

        {/* SCORE */}

        <div className="mx-auto mt-14 max-w-4xl rounded-3xl border border-white/[0.08] bg-white/[0.025] p-7 backdrop-blur-xl md:p-10">
          <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
            <div>
              <SectionLabel>
                Growth Readiness
              </SectionLabel>

              <h2 className="text-3xl font-semibold tracking-[-0.03em]">
                {readiness.label}
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500">
                {readiness.description}
              </p>
            </div>

            <div className="flex h-32 w-32 shrink-0 flex-col items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.025]">
              <span className="text-4xl font-semibold tracking-[-0.05em]">
                {audit.auditScore}
              </span>

              <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-gray-600">
                Score
              </span>
            </div>
          </div>
        </div>

        {/* DIAGNOSIS */}

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <MetricCard
            icon={Target}
            label="Business Stage"
            value={businessStage.label}
            description={
              businessStage.description
            }
          />

          <MetricCard
            icon={TrendingUp}
            label="Acquisition"
            value={acquisitionStatus.label}
            description={
              acquisitionStatus.description
            }
          />

          <MetricCard
            icon={CircleAlert}
            label="Primary Bottleneck"
            value={bottleneck.label}
            description={
              bottleneck.description
            }
          />
        </div>

        {/* PRIMARY DIAGNOSIS */}

        <section className="mt-24">
          <SectionLabel>
            Primary Diagnosis
          </SectionLabel>

          <div className="grid gap-10 md:grid-cols-[1fr_0.8fr] md:items-start">
            <div>
              <h2 className="text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-4xl">
                Your biggest opportunity is
                <span className="text-gray-500">
                  {" "}
                  {bottleneck.label.toLowerCase()}.
                </span>
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-8 text-gray-400">
                {bottleneck.description}
              </p>

              <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">
                  Recommended Focus
                </p>

                <p className="mt-4 text-sm leading-7 text-gray-300">
                  {bottleneck.recommendation}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-7">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035]">
                <Gauge
                  size={18}
                  className="text-gray-300"
                />
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                Don't scale the wrong bottleneck.
              </h3>

              <p className="mt-4 text-sm leading-7 text-gray-500">
                Menambah budget marketing sebelum
                mengetahui bottleneck utama dapat
                membuat biaya acquisition meningkat
                tanpa menyelesaikan masalah conversion.
              </p>
            </div>
          </div>
        </section>

        {/* RECOMMENDATIONS */}

        <section className="mt-24">
          <SectionLabel>
            Recommended Next Steps
          </SectionLabel>

          <h2 className="text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
            Where we would focus first.
          </h2>

          <div className="mt-10 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
            {recommendations.map(
              (item, index) => (
                <div
                  key={`${item.number}-${index}`}
                  className="group relative border-b border-white/[0.07] p-7 last:border-b-0 md:p-8"
                >
                  <div className="grid gap-5 md:grid-cols-[60px_220px_1fr] md:items-center">
                    <span className="text-xs font-medium tracking-[0.18em] text-gray-600">
                      {item.number}
                    </span>

                    <h3 className="text-lg font-semibold">
                      {item.title}
                    </h3>

                    <p className="text-sm leading-7 text-gray-500">
                      {item.description}
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 h-px w-0 bg-white/30 transition-all duration-500 group-hover:w-full" />
                </div>
              )
            )}
          </div>
        </section>

        {/* CTA */}

        <section className="mt-24 overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] px-7 py-14 text-center backdrop-blur-xl md:px-12 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-600">
            Go Deeper
          </p>

          <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.035em] md:text-5xl">
            Want us to look deeper
            <span className="text-gray-500">
              {" "}
              at your growth system?
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-gray-500 md:text-base">
            Audit ini adalah diagnosis awal
            berdasarkan informasi yang Anda berikan.
            Dalam Growth Call, kita bisa membedah
            acquisition, conversion, economics, dan
            peluang improvement secara lebih spesifik.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="https://calendly.com/agencylucratus/discovery-call"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
            >
              Book a 30-Minute Growth Call

              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/"
              className="rounded-full border border-white/[0.08] bg-white/[0.035] px-7 py-4 text-sm font-medium text-gray-300 transition-colors hover:bg-white/[0.07] hover:text-white"
            >
              Back to Lucratus
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}