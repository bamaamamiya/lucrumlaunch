import MetaPixel from "@/app/components/MetaPixel";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import WhoWeServe from "@/app/components/WhoWeServe";
import Services from "@/app/components/Services";
import Results from "@/app/components/Results";
import GrowthAudit from "@/app/components/GrowthAudit";
import EmpowerSection from "@/app/components/EmpowerSection";
import BrandBackground from "@/app/components/BrandBackground";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0D0D0D] text-white">
      <MetaPixel />

      <BrandBackground />

      <Navbar />

      <Hero />

      <WhoWeServe />

      <Services />

      <Results />

      <GrowthAudit />

      <EmpowerSection />
    </main>
  );
}
