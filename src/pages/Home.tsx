import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/sections/HeroSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <Footer />
    </div>
  );
}
