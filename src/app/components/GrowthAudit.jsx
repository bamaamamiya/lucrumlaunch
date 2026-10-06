import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function GrowthAudit() {
  return (
    <section
      id="growth-audit"
      className="relative overflow-hidden border-t border-white/[0.06] py-32 text-white"
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-[140px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        {/* EYEBROW */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <Sparkles size={14} className="text-gray-500" />

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
            Free Growth Diagnosis
          </p>

          <Sparkles size={14} className="text-gray-500" />
        </div>

        {/* HEADLINE */}
        <h2 className="mx-auto max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-6xl">
          Find what is holding
          <span className="text-gray-500"> your acquisition back.</span>
        </h2>

        {/* DESCRIPTION */}
        <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">
          Jawab beberapa pertanyaan tentang bisnis, marketing, dan economics
          Anda. Kami akan membantu mengidentifikasi bottleneck yang paling
          berdampak sebelum Anda mengalokasikan lebih banyak budget.
        </p>

        {/* CTA */}
        <div className="mt-10">
          <Link
            href="/growth-audit"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition-all duration-300 hover:bg-gray-200"
          >
            Start My Free Growth Diagnosis

            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* MICROCOPY */}
        <p className="mt-5 text-xs tracking-wide text-gray-600">
          Personalized diagnosis. No generic marketing advice.
        </p>
      </div>
    </section>
  );
}