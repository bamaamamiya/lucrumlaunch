import Link from "next/link";
import Footer from "./Footer";
import { ArrowUpRight } from "lucide-react";

export default function EmpowerSection() {
  return (
    <>
      <section className="relative overflow-hidden border-t border-white/[0.06] py-32 text-white md:py-40">
        <div className="mx-auto max-w-5xl px-6 text-center">
          {/* EYEBROW */}
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-white/20" />

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
              Growth Partnership
            </p>

            <span className="h-px w-8 bg-white/20" />
          </div>

          {/* HEADLINE */}
          <h2 className="text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-6xl">
            Your growth.
            <br />
            <span className="text-gray-500">Our execution.</span>
          </h2>

          {/* DESCRIPTION */}
          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">
            Anda menyediakan growth capital. Kami menyediakan strategy,
            execution, dan continuous optimization untuk membangun acquisition
            system yang lebih terukur.
          </p>

          {/* CTA */}
          <div className="mt-10">
            <Link
              href="/growth-audit"
              className="group inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-7 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/[0.2] hover:bg-white hover:text-black"
            >
              Get Your Free Growth Audit

              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}