import { Navigation } from "@/components/Navigation";
import { InquirySection } from "@/sections/InquirySection";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";

export default function InquiryPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h))" }}>
        <div className="px-6 md:px-12 lg:px-16 pt-8 mb-4 border-b-[3px] border-black pb-8 bg-white relative z-10">
          <BackButton />
        </div>
        <InquirySection />
      </div>
      <Footer />
    </div>
  );
}
