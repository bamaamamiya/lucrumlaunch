export default function BrandBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden bg-[#0D0D0D]"
      aria-hidden="true"
    >
      {/* Base */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#18181A_0%,#0D0D0D_38%,#0D0D0D_100%)]" />

      {/* Top ambient glow */}
      <div className="absolute left-1/2 top-[-320px] h-[600px] w-[850px] -translate-x-1/2 rounded-full bg-white/[0.018] blur-[150px]" />

      {/* Left ambient glow */}
      <div className="absolute left-[-350px] top-[30%] h-[600px] w-[600px] rounded-full bg-white/[0.009] blur-[140px]" />

      {/* Right ambient glow */}
      <div className="absolute right-[-350px] top-[55%] h-[600px] w-[600px] rounded-full bg-white/[0.008] blur-[140px]" />

      {/* Technical grid */}
      <div
        className="absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage:
            "linear-gradient(to bottom, black 0%, transparent 85%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, transparent 85%)",
        }}
      />

      {/* Fine grain */}
      <div
        className="absolute inset-0 opacity-[0.012] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.8'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Center alignment line */}
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/[0.018]" />

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-[#0D0D0D] to-transparent" />
    </div>
  );
}