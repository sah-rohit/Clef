import { Navigation } from "@/components/Navigation";
import { InquirySection } from "@/sections/InquirySection";
import { Footer } from "@/components/Footer";

export default function InquiryPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h))" }}>
        <InquirySection showBackButton={true} />
      </div>
      <Footer />
    </div>
  );
}
