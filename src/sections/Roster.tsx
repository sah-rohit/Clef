import { useState } from "react";
import { CheckCircle2, Clock, Circle } from "lucide-react";

const artists = [
  {
    id: 1,
    name: "ELENA VASQUEZ",
    discipline: "Editorial Illustration",
    status: "Available",
    availability: "Immediate",
    specialties: ["Portraits", "Political", "Narrative"],
  },
  {
    id: 2,
    name: "MARCUS CHEN",
    discipline: "Motion & Kinetic Type",
    status: "Booked",
    availability: "April 2026",
    specialties: ["Animation", "Typography", "Social"],
  },
  {
    id: 3,
    name: "SOPHIE ANDERSSON",
    discipline: "Brand Identity & Packaging",
    status: "Available",
    availability: "Immediate",
    specialties: ["Identity", "Packaging", "Print"],
  },
  {
    id: 4,
    name: "JAMES O'BRIEN",
    discipline: "Fashion Illustration",
    status: "Limited",
    availability: "2 weeks",
    specialties: ["Editorial", "Runway", "Concept"],
  },
  {
    id: 5,
    name: "YUKI TANAKA",
    discipline: "Abstract & Experimental",
    status: "Available",
    availability: "Immediate",
    specialties: ["Abstract", "Mixed Media", "Gallery"],
  },
  {
    id: 6,
    name: "AMARA DIOP",
    discipline: "Publishing & Book Arts",
    status: "Booked",
    availability: "May 2026",
    specialties: ["Covers", "Interior", "Typography"],
  },
];

export function Roster() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Available":
        return <CheckCircle2 size={16} className="text-green-600" />;
      case "Booked":
        return <Circle size={16} className="text-[#FF0004]" />;
      case "Limited":
        return <Clock size={16} className="text-[#F9FF00]" />;
      default:
        return null;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-50";
      case "Booked":
        return "bg-red-50";
      case "Limited":
        return "bg-yellow-50";
      default:
        return "";
    }
  };

  return (
    <section id="roster" className="py-16 md:py-24 border-b-[3px] border-black">
      <div className="px-6 md:px-12 lg:px-16 mb-12">
        <div className="flex items-end justify-between">
          <div>
            <span className="font-oswald text-xs font-bold uppercase tracking-[0.2em] text-[#FF0004] block mb-2">
              Active Talent
            </span>
            <h2 className="font-oswald text-4xl md:text-6xl font-bold uppercase tracking-[-0.03em]">
              ROSTER
            </h2>
          </div>
          <span className="hidden md:block font-oswald text-sm uppercase tracking-widest">
            6 ARTISTS
          </span>
        </div>
      </div>

      <div className="px-6 md:px-12 lg:px-16 overflow-x-auto">
        <div className="border-[3px] border-black min-w-[800px]">
          {/* Table Header */}
          <div className="grid grid-cols-12 border-b-[3px] border-black bg-[#1a1a1a] text-white">
            <div className="col-span-3 px-4 py-3 font-oswald text-xs font-bold uppercase tracking-widest">
              Artist
            </div>
            <div className="col-span-3 px-4 py-3 font-oswald text-xs font-bold uppercase tracking-widest border-l-[3px] border-white/20">
              Discipline
            </div>
            <div className="col-span-2 px-4 py-3 font-oswald text-xs font-bold uppercase tracking-widest border-l-[3px] border-white/20">
              Status
            </div>
            <div className="col-span-2 px-4 py-3 font-oswald text-xs font-bold uppercase tracking-widest border-l-[3px] border-white/20">
              Availability
            </div>
            <div className="col-span-2 px-4 py-3 font-oswald text-xs font-bold uppercase tracking-widest border-l-[3px] border-white/20">
              Specialties
            </div>
          </div>

          {/* Table Rows */}
          {artists.map((artist, i) => (
            <div
              key={artist.id}
              className={`grid grid-cols-12 border-b-[3px] border-black last:border-b-0 transition-colors cursor-pointer ${
                hoveredRow === artist.id
                  ? "bg-[#F9FF00]"
                  : i % 2 === 0
                  ? "bg-white"
                  : "bg-[#fafafa]"
              }`}
              onMouseEnter={() => setHoveredRow(artist.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <div className="col-span-3 px-4 py-4 flex items-center gap-3">
                <span className="font-oswald text-lg font-bold uppercase tracking-tight">
                  {artist.name}
                </span>
              </div>
              <div className="col-span-3 px-4 py-4 border-l-[3px] border-black flex items-center">
                <span className="font-inter text-sm">{artist.discipline}</span>
              </div>
              <div className="col-span-2 px-4 py-4 border-l-[3px] border-black flex items-center gap-2">
                {getStatusIcon(artist.status)}
                <span className="font-inter text-sm font-medium">
                  {artist.status}
                </span>
              </div>
              <div className="col-span-2 px-4 py-4 border-l-[3px] border-black flex items-center">
                <span
                  className={`font-inter text-sm px-2 py-1 ${getStatusBg(
                    artist.status
                  )}`}
                >
                  {artist.availability}
                </span>
              </div>
              <div className="col-span-2 px-4 py-4 border-l-[3px] border-black flex items-center flex-wrap gap-1">
                {artist.specialties.map((s, j) => (
                  <span
                    key={j}
                    className="font-inter text-[10px] uppercase tracking-wider border border-black px-2 py-0.5 bg-white"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
