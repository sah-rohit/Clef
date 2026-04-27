import { Navigation } from "@/components/Navigation";
import { RosterSection } from "@/sections/RosterSection";
import { Footer } from "@/components/Footer";

export default function RosterPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h))" }}>
        <RosterSection showBackButton={true} />
      </div>
      <Footer />
    </div>
  );
}
