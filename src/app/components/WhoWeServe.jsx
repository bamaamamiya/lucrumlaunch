export default function WhoWeServe() {
  const profiles = [
    {
      number: "01",
      title: "Sudah Punya Traction",
      description:
        "Produk atau service Anda sudah memiliki customer, demand, atau validasi market — bukan masih mencari product-market fit.",
    },
    {
      number: "02",
      title: "Siap Berinvestasi",
      description:
        "Anda melihat marketing sebagai investment untuk growth, dengan budget yang cukup untuk mengumpulkan data dan melakukan testing.",
    },
    {
      number: "03",
      title: "Ingin Scale",
      description:
        "Anda ingin acquisition system yang bisa diukur, diuji, dioptimalkan, lalu dikembangkan berdasarkan data.",
    },
  ];

  return (
    <section
      id="who-we-serve"
      className="relative border-t border-white/[0.06] py-28 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* HEADER */}
        <div className="max-w-3xl">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-white/30" />

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
              Who We Work With
            </p>
          </div>

          <h2 className="text-3xl font-semibold leading-[1.1] tracking-[-0.03em] md:text-5xl">
            Built for businesses
            <span className="text-gray-500">
              {" "}
              ready to invest in growth.
            </span>
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">
            Lucratus bekerja dengan bisnis yang sudah memiliki produk,
            traction, dan market — lalu ingin membangun acquisition system
            yang lebih terukur dan predictable.
          </p>
        </div>

        {/* PROFILE CARDS */}
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] md:grid-cols-3">
          {profiles.map((item) => (
            <div
              key={item.number}
              className="group relative min-h-[250px] bg-[#0D0D0D]/90 p-7 backdrop-blur-xl transition-colors duration-300 hover:bg-[#141416]/95 md:p-8"
            >
              {/* Top accent */}
              <div className="absolute left-0 top-0 h-px w-0 bg-white/50 transition-all duration-500 group-hover:w-full" />

              {/* Number */}
              <div className="mb-12 flex items-center justify-between">
                <span className="text-xs font-medium tracking-[0.15em] text-gray-600">
                  {item.number}
                </span>

                <span className="h-1.5 w-1.5 rounded-full bg-white/20 transition-colors duration-300 group-hover:bg-white/70" />
              </div>

              <h3 className="text-xl font-semibold tracking-[-0.02em] text-white">
                {item.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* QUALIFICATION LINE */}
        <div className="mt-8 flex flex-col gap-4 border-l border-white/[0.12] pl-5 md:flex-row md:items-center md:justify-between md:gap-8">
          <p className="max-w-2xl text-sm leading-6 text-gray-600">
            Jika bisnis Anda masih berada pada tahap validasi produk atau belum
            siap mengalokasikan budget untuk acquisition, kami mungkin belum
            menjadi partner yang tepat.
          </p>

          <span className="shrink-0 text-xs font-medium uppercase tracking-[0.18em] text-gray-600">
            Fit matters
          </span>
        </div>
      </div>
    </section>
  );
}