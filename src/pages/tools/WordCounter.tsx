import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { 
  BarChart3, FileText, Clock, Hash, 
  Settings2, Activity, PieChart, Info,
  BookOpen, Mic, Languages, Search
} from "lucide-react";

export default function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;
    const lines = text.split("\n").length;
    
    // Readability: Flesch-Kincaid Ease (Simplified)
    // 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
    // We'll estimate syllables as roughly charsNoSpaces / 3
    const avgWordsPerSentence = sentences ? words / sentences : 0;
    const avgSyllablesPerWord = words ? (charsNoSpaces / 3) / words : 0;
    const fleschEase = words > 10 ? Math.max(0, Math.min(100, 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord)) : 100;

    // Keyword density
    const wordFreq: Record<string, number> = {};
    if (trimmed) {
      trimmed.toLowerCase().split(/\W+/).filter(w => w.length > 3).forEach(w => {
        wordFreq[w] = (wordFreq[w] || 0) + 1;
      });
    }
    const topKeywords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      words, chars, charsNoSpaces, sentences, paragraphs, lines,
      readingTime: Math.max(1, Math.ceil(words / 200)),
      speakingTime: Math.max(1, Math.ceil(words / 130)),
      fleschEase,
      topKeywords
    };
  }, [text]);

  return (
    <ToolLayout toolId="word-counter">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Primary Stats */}
           <div className="lg:col-span-8 bg-white border-[4px] border-black shadow-[12px_12px_0px_black] overflow-hidden">
              <div className="bg-black text-white px-6 py-4 border-b-[4px] border-black flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <FileText size={18} className="text-[#F9FF00]" />
                    <span className="font-oswald text-sm font-black uppercase tracking-widest">CONTENT_ANALYTICS</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#00FF87] rounded-full animate-pulse" />
                    <span className="font-mono text-[8px] text-[#00FF87] font-bold">REAL_TIME_TRACKING</span>
                 </div>
              </div>
              
              <div className="p-8">
                 <textarea
                   className="w-full h-96 border-[3px] border-black p-8 font-inter text-sm leading-relaxed bg-[#fafafa] focus:bg-white outline-none resize-none transition-all custom-scrollbar"
                   placeholder="Stream content for deep analysis..."
                   value={text}
                   onChange={(e) => setText(e.target.value)}
                 />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 border-t-[4px] border-black bg-[#fafafa]">
                 {[
                   { label: "Words", val: stats.words, icon: Hash },
                   { label: "Characters", val: stats.chars, icon: Languages },
                   { label: "Sentences", val: stats.sentences, icon: Mic },
                   { label: "Paragraphs", val: stats.paragraphs, icon: LayoutGrid },
                 ].map(s => (
                   <div key={s.label} className="p-6 border-r-[2px] border-black last:border-r-0 text-center flex flex-col items-center gap-2">
                      <s.icon size={14} className="opacity-20" />
                      <div className="font-oswald text-3xl font-black">{s.val}</div>
                      <div className="font-oswald text-[9px] font-black uppercase tracking-widest opacity-40">{s.label}</div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Performance & Quality */}
           <div className="lg:col-span-4 space-y-8">
              
              {/* Readability & Time */}
              <div className="bg-[#1a1a1a] text-white p-8 border-[4px] border-black shadow-[12px_12px_0px_black]">
                 <h3 className="font-oswald text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3 text-[#00E5FF]"><BookOpen size={18} /> READABILITY_METRICS</h3>
                 <div className="space-y-8">
                    <div className="flex items-center justify-between">
                       <span className="font-oswald text-[10px] font-black uppercase tracking-widest text-white/40">FLESCH_EASE</span>
                       <span className="font-mono text-lg font-black text-[#00FF87]">{stats.fleschEase.toFixed(0)}</span>
                    </div>
                    <div className="h-2 bg-white/10 border border-white/5">
                       <div className="h-full bg-[#00FF87] transition-all duration-1000" style={{ width: `${stats.fleschEase}%` }} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-white/5 border border-white/10">
                          <Clock size={14} className="text-[#F9FF00] mb-2" />
                          <p className="font-oswald text-[9px] font-black uppercase text-white/20 mb-1">READING_TIME</p>
                          <p className="font-mono text-xs font-bold">{stats.readingTime} MIN</p>
                       </div>
                       <div className="p-4 bg-white/5 border border-white/10">
                          <Mic size={14} className="text-[#F9FF00] mb-2" />
                          <p className="font-oswald text-[9px] font-black uppercase text-white/20 mb-1">SPEAKING_TIME</p>
                          <p className="font-mono text-xs font-bold">{stats.speakingTime} MIN</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Keyword Density */}
              <div className="bg-white border-[4px] border-black p-8 shadow-[12px_12px_0px_black]">
                 <h3 className="font-oswald text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3"><PieChart size={18} className="opacity-30" /> KEYWORD_DENSITY</h3>
                 <div className="space-y-4">
                    {stats.topKeywords.length === 0 ? (
                      <div className="py-12 text-center opacity-10">
                         <Search className="m-auto mb-2" size={24} />
                         <p className="font-oswald text-[10px] font-black">NO_DATA</p>
                      </div>
                    ) : (
                      stats.topKeywords.map(([word, count]) => (
                        <div key={word} className="flex items-center justify-between border-b border-black/5 pb-2">
                           <span className="font-mono text-[10px] font-black uppercase">{word}</span>
                           <span className="font-oswald text-[10px] font-black text-[#FF0004]">{count}x</span>
                        </div>
                      ))
                    )}
                 </div>
              </div>

           </div>

        </div>
      </div>
    </ToolLayout>
  );
}
