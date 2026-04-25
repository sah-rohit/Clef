import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/sections/HeroSection";
import { ToolsGrid } from "@/sections/ToolsGrid";
import { OurPromiseSection } from "@/sections/OurPromiseSection";
import { RosterSection } from "@/sections/RosterSection";
import { InquirySection } from "@/sections/InquirySection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      
      <div id="tools">
        <ToolsGrid />
      </div>
      
      <OurPromiseSection />
      <RosterSection />
      <InquirySection />
      <Footer />
    </div>
  );
}
