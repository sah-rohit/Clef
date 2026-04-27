import { useNavigate } from "react-router";
import { ArrowLeft, Home } from "lucide-react";

interface BackButtonProps {
  to?: string;       // explicit destination (overrides browser history)
  label?: string;    // custom label
}

export function BackButton({ to, label }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      // Go back in browser history; if no history, fall back to home
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="group inline-flex items-center gap-0 font-oswald font-bold uppercase tracking-widest text-[11px] select-none"
      style={{ filter: "drop-shadow(2px 2px 0px rgba(0,0,0,0.6))" }}
    >
      {/* Arrow badge */}
      <span className="flex items-center justify-center w-9 h-9 bg-[#1a1a1a] border-[3px] border-[#1a1a1a] group-hover:bg-[#F9FF00] group-hover:border-[#F9FF00] transition-all duration-150 shrink-0">
        <ArrowLeft
          size={14}
          className="text-[#F9FF00] group-hover:text-[#1a1a1a] group-hover:-translate-x-0.5 transition-all duration-150"
        />
      </span>
      {/* Label */}
      <span className="flex items-center h-9 px-4 bg-white border-[3px] border-l-0 border-[#1a1a1a] text-[#1a1a1a] group-hover:bg-[#1a1a1a] group-hover:text-white transition-all duration-150 whitespace-nowrap">
        {label ?? (to === "/" ? "HOME" : "BACK")}
      </span>
    </button>
  );
}
