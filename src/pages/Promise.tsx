import { Navigation } from "@/components/Navigation";
import { OurPromiseSection } from "@/sections/OurPromiseSection";
import { Footer } from "@/components/Footer";

export default function PromisePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h))" }}>
        <OurPromiseSection showBackButton={true} />
      </div>
      <Footer />
    </div>
  );
}
