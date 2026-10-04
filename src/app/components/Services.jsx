import {
  Target,
  Megaphone,
  Workflow,
  LineChart,
  TrendingUp,
} from "lucide-react";

const systems = [
  {
    icon: Target,
    title: "Strategy",
    description:
      "Kami memahami offer, market, economics, dan growth objective sebelum menentukan acquisition strategy.",
  },
  {
    icon: Megaphone,
    title: "Acquisition",
    description:
      "Kami membangun dan mengoptimalkan paid acquisition untuk menjangkau market yang relevan.",
  },
  {
    icon: Workflow,
    title: "Conversion",
    description:
      "Kami memperbaiki journey dari ad hingga landing page, WhatsApp, dan customer action.",
  },
  {
    icon: LineChart,
    title: "Optimization",
    description:
      "Kami membaca data untuk menemukan bottleneck, winning angles, dan peluang improvement.",
  },
  {
    icon: TrendingUp,
    title: "Scale",
    description:
      "Ketika economics menunjukkan signal yang sehat, kami membantu meningkatkan acquisition secara terukur.",
  },
];

export default function Services() {
  return (
    <section
      id="how-we-work"
      className="relative border-t border-white/[0.06] py-28 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* HEADER */}
        <div className="mb-16 max-w-3xl">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-white/30" />

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
              The Acquisition System
            </p>
          </div>

          <h2 className="text-3xl font-semibold leading-[1.1] tracking-[-0.03em] md:text-5xl">
            Growth is a system,
            <span className="text-gray-500"> not a single campaign.</span>
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">
            Kami melihat offer, creative, traffic, funnel, conversion, dan
            economics sebagai satu sistem yang saling terhubung.
          </p>
        </div>

        {/* SYSTEM */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
          {systems.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group relative border-b border-white/[0.07] last:border-b-0"
              >
                <div className="grid gap-8 px-6 py-8 transition-colors duration-300 hover:bg-white/[0.025] md:grid-cols-[80px_220px_1fr] md:items-center md:px-8 md:py-10">
                  {/* NUMBER */}
                  <div className="flex items-center gap-4 md:block">
                    <span className="text-xs font-medium tracking-[0.18em] text-gray-600">
                      0{index + 1}
                    </span>

                    <div className="h-px w-10 bg-white/[0.08] md:mt-5 md:w-6" />
                  </div>

                  {/* TITLE */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-gray-300 transition-all duration-300 group-hover:border-white/[0.15] group-hover:bg-white/[0.07] group-hover:text-white">
                      <Icon size={19} strokeWidth={1.7} />
                    </div>

                    <h3 className="text-xl font-semibold tracking-[-0.02em]">
                      {item.title}
                    </h3>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="max-w-2xl text-sm leading-7 text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
                    {item.description}
                  </p>
                </div>

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-0 h-px w-0 bg-white/30 transition-all duration-500 group-hover:w-full" />
              </div>
            );
          })}
        </div>

        {/* BOTTOM STATEMENT */}
        <div className="mt-10 flex flex-col gap-5 border-l border-white/[0.12] pl-5 md:flex-row md:items-center md:justify-between md:gap-10">
          <p className="max-w-2xl text-sm leading-7 text-gray-600">
            Setiap tahap menghasilkan data untuk tahap berikutnya. Tujuannya
            bukan sekadar menjalankan campaign, tetapi membangun sistem
            acquisition yang semakin efektif dari waktu ke waktu.
          </p>

          <span className="shrink-0 text-xs font-medium uppercase tracking-[0.18em] text-gray-600">
            Strategy → Acquisition → Conversion → Optimization → Scale
          </span>
        </div>
      </div>
    </section>
  );
}