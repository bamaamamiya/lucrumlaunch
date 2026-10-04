import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WhoWeServe from "./components/WhoWeServe";
import Services from "./components/Services";
import Results from "./components/Results";
import GrowthAudit from "./components/GrowthAudit";
import EmpowerSection from "./components/EmpowerSection";
import BrandBackground from "./components/BrandBackground";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0D0D0D] text-white">
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
