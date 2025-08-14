import Footer from "@/components/component-landing/footer-section";
import { FourthSection } from "@/components/component-landing/fourth-section";
import { HeroSection } from "@/components/component-landing/hero-section";
import { Navbar } from "@/components/component-landing/navbar";
import AnalysisDashboard from "@/components/component-landing/pre-section";
import { SecondSection } from "@/components/component-landing/second-section";
import { ThirdSection } from "@/components/component-landing/third-section";

export default function Home() {
  return (
    <div className="bg-white">
      <Navbar />
      <HeroSection />
      <AnalysisDashboard />
      <SecondSection />
      <FourthSection />
      <Footer />
    </div>
  );
}
