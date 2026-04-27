import { Navigation } from "@/components/Navigation";
import { ToolsGrid } from "@/sections/ToolsGrid";
import { OurPromiseSection } from "@/sections/OurPromiseSection";
import { RosterSection } from "@/sections/RosterSection";
import { InquirySection } from "@/sections/InquirySection";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";

export default function Features() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Push content below fixed nav + ribbon */}
      <div style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h))" }}>
        <div id="tools" className="relative">
          <div className="px-6 md:px-12 lg:px-16 pt-8 mb-4">
            <BackButton />
          </div>
          <ToolsGrid />
        </div>

        <div id="promise">
          <OurPromiseSection />
        </div>

        <div id="roster">
          <RosterSection />
        </div>

        <div id="inquiry">
          <InquirySection />
        </div>
      </div>

      <Footer />
    </div>
  );
}
