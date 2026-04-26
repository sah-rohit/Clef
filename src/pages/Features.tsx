import { Navigation } from "@/components/Navigation";
import { ToolsGrid } from "@/sections/ToolsGrid";
import { OurPromiseSection } from "@/sections/OurPromiseSection";
import { RosterSection } from "@/sections/RosterSection";
import { InquirySection } from "@/sections/InquirySection";
import { Footer } from "@/components/Footer";

export default function Features() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Push content below fixed nav + ribbon */}
      <div style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h))" }}>
        <div id="tools">
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
