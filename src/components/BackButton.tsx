// BackButton — redesigned as a floating pill that reads on any background
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

export function BackButton({ to = "/" }: { to?: string }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="group inline-flex items-center gap-0 font-oswald font-bold uppercase tracking-widest text-[11px] select-none"
      style={{ filter: "drop-shadow(2px 2px 0px rgba(0,0,0,0.8))" }}
    >
      {/* Arrow badge — always black bg, yellow icon */}
      <span className="flex items-center justify-center w-9 h-9 bg-[#1a1a1a] border-[3px] border-[#1a1a1a] group-hover:bg-[#F9FF00] group-hover:border-[#F9FF00] transition-all duration-150 shrink-0">
        <ArrowLeft size={14} className="text-[#F9FF00] group-hover:text-[#1a1a1a] transition-colors duration-150 group-hover:-translate-x-0.5 transition-transform" />
      </span>
      {/* Label — white bg with black border so it reads on any background */}
      <span className="flex items-center h-9 px-4 bg-white border-[3px] border-l-0 border-[#1a1a1a] text-[#1a1a1a] group-hover:bg-[#1a1a1a] group-hover:text-white transition-all duration-150 whitespace-nowrap">
        BACK TO HOME
      </span>
    </button>
  );
}
