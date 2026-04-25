import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export function BackButton({ to = "/" }: { to?: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 font-oswald text-xs font-bold uppercase tracking-wider hover:text-[#FF0004] transition-colors mb-8"
    >
      <ArrowLeft size={16} />
      BACK TO HOME
    </Link>
  );
}
