import { BackButton } from "@/components/BackButton";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center">
        <div className="font-oswald text-[120px] md:text-[180px] font-bold leading-none tracking-[-0.05em] text-[#1a1a1a]/10 mb-4">
          404
        </div>
        <h1 className="font-oswald text-3xl md:text-4xl font-bold uppercase tracking-[-0.02em] mb-4">
          PAGE NOT FOUND
        </h1>
        <p className="font-inter text-sm text-[#1a1a1a]/60 mb-8 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex justify-center mb-8">
          <BackButton />
        </div>

        {/* Decorative */}
        <div className="flex justify-center gap-0 mt-12">
          <div className="w-16 h-16 bg-[#F9FF00] border-[3px] border-black" />
          <div className="w-16 h-16 bg-[#00E5FF] border-[3px] border-black" />
          <div className="w-16 h-16 bg-[#FF0004] border-[3px] border-black" />
          <div className="w-16 h-16 bg-[#00FF87] border-[3px] border-black" />
          <div className="w-16 h-16 bg-[#7C3AED] border-[3px] border-black" />
          <div className="w-16 h-16 bg-[#1a1a1a] border-[3px] border-black" />
        </div>
      </div>
    </div>
  );
}
