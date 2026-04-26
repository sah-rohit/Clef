import { useState, useEffect, useRef } from "react";
import { 
  Send, Copy, ThumbsUp, ThumbsDown, Pin, PinOff, 
  RotateCcw, StopCircle, Bot, Play,
  Trash2, Edit3, ChevronLeft, ChevronRight, MessageSquare, Shield, X
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";

import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

interface MessageVersion {
  content: string;
  timestamp: number;
}

interface MessagePair {
  id: string;
  user: {
    versions: MessageVersion[];
    currentIdx: number;
  };
  ai: {
    versions: MessageVersion[];
    currentIdx: number;
  };
  pinned: boolean;
  expanded: boolean;
  feedback?: 'up' | 'down' | null;
  stopped?: boolean;
}

export function ClefAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [pairs, setPairs] = useState<MessagePair[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [stats, setStats] = useState({ hour: 0, day: 0 });
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatAction = useAction(api.ai.chat);

  const isEmailUser = user && !user.isGuest;
  const limits = isEmailUser
    ? { hour: 20, day: 80 }
    : { hour: 10, day: 50 };

  useEffect(() => {
    updateStats();
    const saved = localStorage.getItem("clef_ai_history");
    if (saved) {
      try {
        setPairs(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (pairs.length > 0) {
      localStorage.setItem("clef_ai_history", JSON.stringify(pairs));
    } else {
      localStorage.removeItem("clef_ai_history");
    }
  }, [pairs]);

  const updateStats = () => {
    const now = Date.now();
    const chatLogs = JSON.parse(localStorage.getItem("clef_chat_logs") || "[]");
    const lastHour = chatLogs.filter((t: number) => now - t < 3600000);
    const lastDay = chatLogs.filter((t: number) => now - t < 86400000);
    setStats({ hour: lastHour.length, day: lastDay.length });
  };

  const checkRateLimit = () => {
    const now = Date.now();
    const chatLogs = JSON.parse(localStorage.getItem("clef_chat_logs") || "[]");
    const lastHour = chatLogs.filter((t: number) => now - t < 3600000);
    const lastDay = chatLogs.filter((t: number) => now - t < 86400000);

    if (lastHour.length >= limits.hour) {
      showToast(`Hourly limit reached (${limits.hour} chats).`, "error");
      return false;
    }
    if (lastDay.length >= limits.day) {
      showToast(`Daily limit reached (${limits.day} chats).`, "error");
      return false;
    }

    const updatedLogs = [...lastDay, now];
    localStorage.setItem("clef_chat_logs", JSON.stringify(updatedLogs));
    setStats({ hour: lastHour.length + 1, day: lastDay.length + 1 });
    return true;
  };

  const handleNewChat = () => {
    if (pairs.length === 0) return;
    setPairs([]);
    localStorage.removeItem("clef_ai_history");
    showToast("New chat started.", "success");
  };

  const handleSend = async (customInput?: string, pairIndex?: number) => {
    const text = customInput || input;
    if (!text.trim() || isTyping) return;
    if (!checkRateLimit()) return;

    setIsTyping(true);
    if (!customInput) setInput("");

    let currentPairs = [...pairs];
    let activePair: MessagePair;

    if (pairIndex !== undefined) {
      activePair = { ...currentPairs[pairIndex] };
      if (customInput) {
        activePair.user.versions.push({ content: text, timestamp: Date.now() });
        activePair.user.currentIdx = activePair.user.versions.length - 1;
      }
      activePair.ai.versions.push({ content: "", timestamp: Date.now() });
      activePair.ai.currentIdx = activePair.ai.versions.length - 1;
      activePair.stopped = false;
      currentPairs[pairIndex] = activePair;
    } else {
      activePair = {
        id: Math.random().toString(36).substr(2, 9),
        user: { versions: [{ content: text, timestamp: Date.now() }], currentIdx: 0 },
        ai: { versions: [{ content: "", timestamp: Date.now() }], currentIdx: 0 },
        pinned: false,
        expanded: false,
        stopped: false
      };
      currentPairs.push(activePair);
    }
    setPairs(currentPairs);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const chatMessages = [
        ...currentPairs.slice(0, pairIndex !== undefined ? pairIndex : currentPairs.length - 1).flatMap(p => [
          { role: "user", content: p.user.versions[p.user.currentIdx].content },
          { role: "assistant", content: p.ai.versions[p.ai.currentIdx].content }
        ]),
        { role: "user", content: text }
      ];

      const result = await chatAction({ messages: chatMessages });
      
      setPairs(prev => {
        const newPairs = [...prev];
        const idx = pairIndex !== undefined ? pairIndex : newPairs.length - 1;
        newPairs[idx].ai.versions[newPairs[idx].ai.currentIdx].content = result;
        return newPairs;
      });
    } catch (err: any) {
      showToast("AI Engine error. Please try again.", "error");
    } finally {
      setIsTyping(false);
      setAbortController(null);
    }
  };

  const handleStop = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  const handleContinue = (idx: number) => {
    // To continue, we simply send a prompt "Please continue exactly from where you left off"
    // We add it as a new message so the model understands the context and picks up the trail.
    handleSend("Please continue exactly from where you left off.");
  };

  const deletePair = (idx: number) => {
    setPairs(prev => prev.filter((_, i) => i !== idx));
    showToast("Message deleted.", "info");
  };

  const togglePin = (idx: number) => {
    setPairs(prev => {
      const n = [...prev];
      n[idx].pinned = !n[idx].pinned;
      return n;
    });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [pairs, isTyping, isOpen]);

  const ClefLogo = () => <Bot size={24} className="shrink-0" />;

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 md:w-16 md:h-16 bg-[#1a1a1a] text-white border-[3px] md:border-[4px] border-black flex items-center justify-center hover:bg-[#F9FF00] hover:text-black transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_rgba(0,0,0,1)] group"
        >
          <ClefLogo />
          <div className="absolute right-full mr-4 px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
            Clef AI
          </div>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 z-[100] md:z-50 w-full h-full md:w-[420px] md:h-[650px] transition-all duration-300 flex flex-col border-[4px] border-black bg-white shadow-none md:shadow-[12px_12px_0px_rgba(0,0,0,1)] animate-slide-up overflow-hidden">
          <div className="bg-[#1a1a1a] text-white px-4 md:px-6 py-4 flex items-center justify-between border-b-[4px] border-black shrink-0">
            <div className="flex items-center gap-3 md:gap-4">
              <ClefLogo />
              <span className="font-oswald text-base md:text-lg font-bold uppercase tracking-[0.2em] text-[#F9FF00]">Clef AI</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <button onClick={handleNewChat} className="p-2 hover:bg-[#F9FF00] hover:text-black transition-colors border-[2px] border-transparent hover:border-black" title="New Chat"><RotateCcw size={16} /></button>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-[#FF0004] transition-colors border-[2px] border-transparent hover:border-black" title="Close"><X size={20} /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 bg-[#fafafa]">
            {pairs.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-20 select-none py-10 md:py-20 animate-fade-in">
                <ClefLogo />
                <p className="font-oswald text-xl md:text-2xl font-bold uppercase tracking-[0.2em] mt-6 text-center leading-tight">System Ready.<br />Awaiting Input.</p>
                <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-sm px-4">
                  <div className="border-[2px] border-black p-3 text-[10px] font-bold uppercase text-center">Logic Engine v3.1</div>
                  <div className="border-[2px] border-black p-3 text-[10px] font-bold uppercase text-center">Memory Buffer [0%]</div>
                </div>
              </div>
            )}
            
            {pairs.map((pair, idx) => (
              <div key={pair.id} className="space-y-6 animate-fade-in">
                <div className="flex justify-end pl-8 md:pl-12">
                  <div className="bg-[#F9FF00] border-[3px] border-black p-4 relative group shadow-[4px_4px_0px_rgba(0,0,0,1)] max-w-full">
                    <div className="font-inter text-xs font-medium whitespace-pre-wrap break-words">{pair.user.versions[pair.user.currentIdx].content}</div>
                    {pair.user.versions.length > 1 && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t-[2px] border-black text-black/50 justify-end">
                        <button onClick={() => setPairs(prev => { const n = [...prev]; n[idx].user.currentIdx = Math.max(0, n[idx].user.currentIdx - 1); return n; })} className="hover:text-black p-1"><ChevronLeft size={14} /></button>
                        <span className="font-oswald text-[10px] font-bold">{pair.user.currentIdx + 1} / {pair.user.versions.length}</span>
                        <button onClick={() => setPairs(prev => { const n = [...prev]; n[idx].user.currentIdx = Math.min(n[idx].user.versions.length - 1, n[idx].user.currentIdx + 1); return n; })} className="hover:text-black p-1"><ChevronRight size={14} /></button>
                      </div>
                    )}
                    <div className="md:absolute md:-left-12 md:top-0 md:flex md:flex-col md:gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2 mt-2 md:mt-0 pt-2 md:pt-0 border-t-[2px] border-black md:border-none">
                      <button onClick={() => { setInput(pair.user.versions[pair.user.currentIdx].content); showToast("Prompt ready.", "info"); }} className="p-1.5 md:p-2 hover:bg-black hover:text-[#F9FF00] transition-colors border-[2px] border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)]" title="Edit Prompt"><Edit3 size={12} /></button>
                      <button onClick={() => deletePair(idx)} className="p-1.5 md:p-2 hover:bg-[#FF0004] hover:text-white transition-colors border-[2px] border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)]" title="Delete Pair"><Trash2 size={12} /></button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-start pr-4 md:pr-12">
                  <div className={`border-[3px] border-black p-4 md:p-5 relative group w-full shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-colors ${pair.pinned ? "bg-[#f0f0f0]" : "bg-white"}`}>
                    <div className={`font-inter text-xs leading-relaxed overflow-hidden ${pair.expanded || pair.ai.versions[pair.ai.currentIdx].content.length < 500 ? "" : "max-h-[250px] mask-gradient"} relative`}>
                      <div className="whitespace-pre-wrap break-words">{pair.ai.versions[pair.ai.currentIdx].content}</div>
                      {!pair.expanded && pair.ai.versions[pair.ai.currentIdx].content.length >= 500 && (
                        <button onClick={() => { setPairs(prev => { const n = [...prev]; n[idx].expanded = true; return n; }); }} className="absolute bottom-0 left-0 w-full py-4 bg-gradient-to-t from-white to-transparent font-oswald text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF0004] hover:text-black transition-colors">Expand Intelligence</button>
                      )}
                    </div>
                    <div className="mt-4 md:mt-6 flex flex-col md:flex-row md:items-center justify-between border-t-[2px] border-black pt-4 gap-4 md:gap-0">
                      <div className="flex items-center gap-4 justify-between md:justify-start w-full md:w-auto">
                        <div className="flex items-center gap-4">
                          <button onClick={() => { navigator.clipboard.writeText(pair.ai.versions[pair.ai.currentIdx].content); showToast("Copied!", "success"); }} className="hover:text-[#FF0004] transition-colors p-1" title="Copy"><Copy size={14} /></button>
                          <button onClick={() => togglePin(idx)} className={`transition-colors p-1 ${pair.pinned ? "text-[#FF0004]" : "hover:text-[#FF0004]"}`} title="Pin Message">{pair.pinned ? <PinOff size={14} /> : <Pin size={14} />}</button>
                        </div>
                        <div className="flex items-center gap-2 border-l-[2px] border-black pl-4">
                          <button onClick={() => { setPairs(prev => { const n = [...prev]; n[idx].feedback = n[idx].feedback === 'up' ? null : 'up'; return n; }); }} className={`transition-colors p-1 ${pair.feedback === 'up' ? 'text-[#059669]' : 'hover:text-[#059669]'}`}><ThumbsUp size={14} /></button>
                          <button onClick={() => { setPairs(prev => { const n = [...prev]; n[idx].feedback = n[idx].feedback === 'down' ? null : 'down'; return n; }); }} className={`transition-colors p-1 ${pair.feedback === 'down' ? 'text-[#FF0004]' : 'hover:text-[#FF0004]'}`}><ThumbsDown size={14} /></button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                        {pair.ai.versions.length > 1 && (
                          <div className="flex items-center gap-2 text-black/50 border-r-[2px] border-black pr-4">
                            <button onClick={() => setPairs(prev => { const n = [...prev]; n[idx].ai.currentIdx = Math.max(0, n[idx].ai.currentIdx - 1); return n; })} className="hover:text-black p-1"><ChevronLeft size={14} /></button>
                            <span className="font-oswald text-[10px] font-bold">{pair.ai.currentIdx + 1} / {pair.ai.versions.length}</span>
                            <button onClick={() => setPairs(prev => { const n = [...prev]; n[idx].ai.currentIdx = Math.min(n[idx].ai.versions.length - 1, n[idx].ai.currentIdx + 1); return n; })} className="hover:text-black p-1"><ChevronRight size={14} /></button>
                          </div>
                        )}
                        <div className="flex gap-4">
                          {pair.stopped && (
                            <button onClick={() => handleContinue(idx)} className="font-oswald text-[10px] font-bold uppercase tracking-widest hover:text-[#059669] flex items-center gap-1"><Play size={10} /> Continue</button>
                          )}
                          {pair.expanded && pair.ai.versions[pair.ai.currentIdx].content.length >= 500 && (
                            <button onClick={() => { setPairs(prev => { const n = [...prev]; n[idx].expanded = false; return n; }); }} className="font-oswald text-[10px] font-bold uppercase tracking-widest hover:text-[#FF0004]">Collapse</button>
                          )}
                          <button onClick={() => handleSend(pair.user.versions[pair.user.currentIdx].content, idx)} className="hover:text-[#FF0004] transition-colors p-1 flex items-center gap-1 font-oswald text-[10px] font-bold tracking-widest" title="Regenerate Response"><RotateCcw size={12} /> RETRY</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={scrollRef} className="h-4" />
          </div>

          <div className="p-4 md:p-6 border-t-[4px] border-black bg-white shrink-0 shadow-[0px_-4px_10px_rgba(0,0,0,0.05)]">
            <div className="flex gap-2 md:gap-3">
              <textarea
                className="flex-1 border-[3px] border-black p-3 md:p-4 font-inter text-xs font-medium outline-none resize-none focus:bg-[#F9FF00]/5 min-h-[50px] max-h-[120px] placeholder:text-black/30"
                placeholder="INPUT COMMAND..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              />
              <button 
                onClick={() => isTyping ? handleStop() : handleSend()} 
                className={`w-14 md:w-16 ${isTyping ? "bg-[#FF0004]" : "bg-[#F9FF00]"} border-[3px] border-black hover:bg-black hover:text-white transition-all flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 shrink-0`}
              >
                {isTyping ? <StopCircle size={20} /> : <Send size={20} />}
              </button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3 md:gap-4">
                <p className="text-[8px] md:text-[9px] font-bold uppercase text-black/40 tracking-[0.2em] flex items-center gap-1"><Shield size={10} className="hidden md:block"/> Llama 3.1 8B</p>
                <div className="h-1 w-1 bg-black/20 rounded-full" />
                <p className="text-[8px] md:text-[9px] font-bold uppercase text-black/40 tracking-[0.2em]">Groq Engine</p>
              </div>
              <p className="text-[8px] md:text-[9px] font-bold uppercase text-black/40 tracking-[0.2em]">
                {stats.hour}/{limits.hour} HR • {stats.day}/{limits.day} DAY
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
