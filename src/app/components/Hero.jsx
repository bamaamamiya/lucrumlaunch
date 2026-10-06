import Link from "next/link";

const metrics = [
  {
    label: "Ad Spend",
    value: "Rp12.4M",
  },
  {
    label: "Leads",
    value: "384",
  },
  {
    label: "CAC",
    value: "Rp32.2K",
  },
  {
    label: "Revenue",
    value: "Rp86.2M",
  },
  {
    label: "ROAS",
    value: "4.8x",
  },
  {
    label: "Conv. Rate",
    value: "8.4%",
  },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden px-6 pb-20 pt-32">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-16 md:flex-row md:gap-10">
        {/* TEXT */}
        <div className="relative z-10 w-full md:w-[52%]">
          {/* Eyebrow */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.035] px-4 py-2 text-sm text-gray-400 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
            Growth & Acquisition Partner
          </div>

          {/* Heading */}
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.03] tracking-[-0.035em] text-white sm:text-5xl md:text-6xl lg:text-[68px]">
            Bangun <span className="text-gray-500">acquisition system</span>{" "}
            yang lebih terukur.
          </h1>

          {/* Description */}
          <p className="mt-7 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg md:text-xl">
            Kami membantu bisnis yang sedang berkembang mengubah paid media,
            creative, dan conversion strategy menjadi sistem untuk mendapatkan
            customer secara lebih konsisten.
          </p>

          {/* CTA */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/growth-audit"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 font-semibold text-black transition-all duration-300 hover:bg-gray-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.12)]"
            >
              Dapatkan Free Growth Diagnosis
            </Link>

            <Link
              href="#how-we-work"
              className="inline-flex items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.02] px-6 py-3.5 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06]"
            >
              Cara Kami Bekerja
            </Link>
          </div>

          {/* Qualification */}
          <div className="mt-7 flex items-center gap-3 text-sm text-gray-600">
            <span className="h-px w-8 bg-gray-800" />
            <span>Untuk bisnis yang siap berinvestasi dalam growth.</span>
          </div>
        </div>

        {/* DASHBOARD */}
        <div className="relative z-10 w-full md:w-[48%]">
          <div className="relative mx-auto w-full max-w-[620px]">
            {/* Ambient Glow */}
            <div className="absolute -inset-16 rounded-full bg-white/[0.035] blur-[100px]" />

            {/* Secondary Glow */}
            <div className="absolute left-1/2 top-1/2 h-[55%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-[80px]" />

            {/* Dashboard */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.12] bg-[#111113]/90 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl">
              {/* Top highlight */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4 sm:px-6">
                <div>
                  <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-gray-600">
                    Lucratus
                  </p>

                  <h3 className="mt-1 text-sm font-semibold text-white">
                    Acquisition Overview
                  </h3>
                </div>

                <div className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-[9px] text-gray-500">
                  Last 30 Days
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 border-b border-white/[0.08]">
                {metrics.map((metric, index) => (
                  <div
                    key={metric.label}
                    className={`
                      px-4 py-4 sm:px-5
                      border-white/[0.08]
                      ${index < 3 ? "border-b" : ""}
                      ${index % 3 !== 2 ? "border-r" : ""}
                    `}
                  >
                    <p className="text-[9px] uppercase tracking-wider text-gray-600">
                      {metric.label}
                    </p>

                    <p className="mt-1.5 text-base font-semibold tracking-tight text-white sm:text-lg">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="px-5 py-5 sm:px-6">
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.15em] text-gray-600">
                      Performance
                    </p>

                    <p className="mt-1 text-sm font-medium text-white">
                      Acquisition Growth
                    </p>
                  </div>

                  <span className="text-[10px] text-gray-500">+28.4%</span>
                </div>

                {/* Chart Container */}
                <div className="relative h-36 overflow-hidden rounded-xl border border-white/[0.06] bg-[#0D0D0D] sm:h-40">
                  {/* Chart Grid */}
                  <div
                    className="absolute inset-0 opacity-[0.045]"
                    style={{
                      backgroundImage:
                        "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  />

                  {/* Chart */}
                  <svg
                    viewBox="0 0 600 180"
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full"
                  >
                    <defs>
                      <linearGradient
                        id="chartGradient"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="white"
                          stopOpacity="0.10"
                        />

                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Area */}
                    <path
                      d="
                        M0 145
                        C50 135, 70 125, 110 130
                        C150 135, 165 105, 205 110
                        C245 115, 270 90, 310 95
                        C350 100, 375 70, 415 78
                        C455 85, 480 55, 520 62
                        C555 68, 575 35, 600 25
                        L600 180
                        L0 180 Z
                      "
                      fill="url(#chartGradient)"
                    />

                    {/* Line */}
                    <path
                      d="
                        M0 145
                        C50 135, 70 125, 110 130
                        C150 135, 165 105, 205 110
                        C245 115, 270 90, 310 95
                        C350 100, 375 70, 415 78
                        C455 85, 480 55, 520 62
                        C555 68, 575 35, 600 25
                      "
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>

                  {/* Current Point */}
                  <div className="absolute right-[6.5%] top-[9%] h-2 w-2 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.75)]" />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-white/[0.08] px-5 py-3.5 sm:px-6">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />

                  <span className="text-[9px] text-gray-500">
                    Acquisition system active
                  </span>
                </div>

                <span className="text-[9px] tracking-wide text-gray-700">
                  lucratusagency
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
