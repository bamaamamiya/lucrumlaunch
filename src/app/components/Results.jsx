import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Database,
  Layers3,
} from "lucide-react";

const resultTypes = [
  {
    icon: BarChart3,
    number: "01",
    title: "Acquisition Performance",
    description:
      "Kami mengukur performance dari traffic hingga conversion untuk memahami channel dan campaign yang benar-benar menghasilkan.",
  },
  {
    icon: Database,
    number: "02",
    title: "Data-Driven Decisions",
    description:
      "Setiap optimization berdasarkan data, bukan asumsi. Kami mencari winning angles, bottleneck, dan opportunity untuk improvement.",
  },
  {
    icon: Layers3,
    number: "03",
    title: "Growth Systems",
    description:
      "Campaign bukan tujuan akhir. Kami membangun sistem yang menghubungkan acquisition, conversion, dan economics bisnis.",
  },
];

export default function Results() {
  return (
    <section
      id="results"
      className="relative border-t border-white/[0.06] py-28 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* HEADER */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-white/30" />

              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                Selected Results
              </p>
            </div>

            <h2 className="text-3xl font-semibold leading-[1.1] tracking-[-0.03em] md:text-5xl">
              Proven by data,
              <span className="text-gray-500"> not promises.</span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">
              Kami percaya performance marketing harus dapat dibaca,
              dianalisis, dan dipertanggungjawabkan melalui data.
            </p>
          </div>

          <Link
            href="/results"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.035] px-5 py-3 text-sm font-medium text-gray-300 backdrop-blur-md transition-all duration-300 hover:border-white/[0.2] hover:bg-white/[0.08] hover:text-white"
          >
            View Case Studies
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* PERFORMANCE FRAMEWORK */}
        <div className="mt-16 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
          <div className="grid md:grid-cols-3">
            {resultTypes.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.number}
                  className={`group relative min-h-[280px] p-7 transition-colors duration-300 hover:bg-white/[0.025] md:p-9 ${
                    index !== 0
                      ? "border-t border-white/[0.07] md:border-l md:border-t-0"
                      : ""
                  }`}
                >
                  {/* NUMBER */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium tracking-[0.18em] text-gray-600">
                      {item.number}
                    </span>

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-gray-400 transition-all duration-300 group-hover:border-white/[0.16] group-hover:bg-white/[0.07] group-hover:text-white">
                      <Icon size={17} strokeWidth={1.7} />
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="mt-16">
                    <h3 className="text-xl font-semibold tracking-[-0.02em]">
                      {item.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
                      {item.description}
                    </p>
                  </div>

                  {/* Hover line */}
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-white/30 transition-all duration-500 group-hover:w-full" />
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM STATEMENT */}
        <div className="mt-10 flex flex-col gap-4 border-l border-white/[0.12] pl-5 md:flex-row md:items-center md:justify-between md:gap-8">
          <p className="max-w-2xl text-sm leading-7 text-gray-600">
            Real case studies akan ditampilkan berdasarkan campaign dan
            partnership yang dapat kami dokumentasikan secara transparan.
          </p>

          <Link
            href="/results"
            className="group inline-flex shrink-0 items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-gray-500 transition-colors hover:text-white"
          >
            Explore Results
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}