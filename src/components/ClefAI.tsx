import { useState, useEffect, useRef, useCallback } from "react";
import {
  Send, Copy, ThumbsUp, ThumbsDown, Pin, PinOff,
  RotateCcw, StopCircle, Bot, MessageSquare, Shield, X, Plus, Trash2,
  Maximize2, Minimize2, Sparkles, Terminal, Cpu, Activity
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AIMarkdown } from "@/components/AIMarkdown";
import gsap from "gsap";

interface MessageVersion { content: string; timestamp: number; }
interface MessagePair {
  id: string;
  user: { versions: MessageVersion[]; currentIdx: number };
  ai:   { versions: MessageVersion[]; currentIdx: number };
  pinned: boolean;
  expanded: boolean;
  feedback?: "up" | "down" | null;
  stopped?: boolean;
}
interface Conversation {
  id: string; title: string; pairs: MessagePair[];
  createdAt: number; updatedAt: number;
}

function loadConversations(): Conversation[] {
  try { return JSON.parse(localStorage.getItem("clef_conversations") || "[]"); }
  catch { return []; }
}
function saveConversations(c: Conversation[]) {
  localStorage.setItem("clef_conversations", JSON.stringify(c));
}

export function ClefAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [abortCtrl, setAbortCtrl] = useState<AbortController | null>(null);
  const [stats, setStats] = useState({ hour: 0, day: 0 });

  const { user } = useAuth();
  const { showToast } = useToast();
  const messagesRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatAction = useAction(api.ai.chat);

  const isEmailUser = user && !user.isGuest;
  const limits = isEmailUser ? { hour: 20, day: 80 } : { hour: 10, day: 50 };
  const activeConvo = conversations.find(c => c.id === activeConvoId);
  const pairs = activeConvo?.pairs || [];
  const pinnedPairs = pairs.filter(p => p.pinned);

  useEffect(() => { saveConversations(conversations); }, [conversations]);

  const scrollToBottom = useCallback(() => {
    const el = messagesRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, []);

  // ── Intro Animation ──
  useEffect(() => {
    if (isOpen) {
      const tl = gsap.timeline();
      tl.fromTo(".ai-panel", 
        { y: 100, opacity: 0, scale: 0.9, rotateX: -10 },
        { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 0.6, ease: "power4.out" }
      );
      tl.fromTo(".ai-header-item",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "back.out(1.7)" },
        "-=0.3"
      );
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [pairs, isTyping, isOpen, scrollToBottom]);

  function checkRateLimit() {
    const now = Date.now();
    const logs = JSON.parse(localStorage.getItem("clef_chat_logs") || "[]");
    const hr = logs.filter((t: number) => now - t < 3600000);
    const day = logs.filter((t: number) => now - t < 86400000);
    if (hr.length >= limits.hour) { showToast(`Hourly limit reached (${limits.hour}).`, "error"); return false; }
    if (day.length >= limits.day) { showToast(`Daily limit reached (${limits.day}).`, "error"); return false; }
    localStorage.setItem("clef_chat_logs", JSON.stringify([...day, now]));
    setStats({ hour: hr.length + 1, day: day.length + 1 });
    return true;
  }

  const handleNewChat = () => { setActiveConvoId(null); setShowHistory(false); };
  const loadConversation = (id: string) => { setActiveConvoId(id); setShowHistory(false); };
  const deleteConversation = (id: string) => {
    setConversations(p => p.filter(c => c.id !== id));
    if (activeConvoId === id) setActiveConvoId(null);
    showToast("Purged.", "info");
  };

  const updateActivePairs = (fn: (p: MessagePair[]) => MessagePair[]) => {
    setConversations(prev => prev.map(c =>
      c.id !== activeConvoId ? c : { ...c, pairs: fn(c.pairs), updatedAt: Date.now() }
    ));
  };

  const togglePin = (idx: number) => {
    updateActivePairs(prev => prev.map((p, i) => i === idx ? { ...p, pinned: !p.pinned } : p));
  };

  const handleSend = async (customInput?: string, pairIndex?: number) => {
    const text = customInput || input;
    if (!text.trim() || isTyping) return;
    if (!checkRateLimit()) return;

    setIsTyping(true);
    if (!customInput) setInput("");

    let cid = activeConvoId;
    let cPairs = [...pairs];

    if (!cid) {
      const nc: Conversation = {
        id: crypto.randomUUID(), title: text.slice(0, 50),
        pairs: [], createdAt: Date.now(), updatedAt: Date.now(),
      };
      cid = nc.id;
      setConversations(p => [nc, ...p]);
      setActiveConvoId(nc.id);
      cPairs = [];
    }

    let ap: MessagePair;
    if (pairIndex !== undefined) {
      ap = { ...cPairs[pairIndex] };
      if (customInput) {
        ap.user.versions.push({ content: text, timestamp: Date.now() });
        ap.user.currentIdx = ap.user.versions.length - 1;
      }
      ap.ai.versions.push({ content: "", timestamp: Date.now() });
      ap.ai.currentIdx = ap.ai.versions.length - 1;
      ap.stopped = false;
      cPairs[pairIndex] = ap;
    } else {
      ap = {
        id: Math.random().toString(36).slice(2, 9),
        user: { versions: [{ content: text, timestamp: Date.now() }], currentIdx: 0 },
        ai:   { versions: [{ content: "", timestamp: Date.now() }],   currentIdx: 0 },
        pinned: false, expanded: false, stopped: false,
      };
      cPairs.push(ap);
    }

    const finalCid = cid;
    setConversations(p => p.map(c =>
      c.id === finalCid ? { ...c, pairs: cPairs, updatedAt: Date.now() } : c
    ));

    try {
      const msgs = [
        ...cPairs
          .slice(0, pairIndex !== undefined ? pairIndex : cPairs.length - 1)
          .flatMap(p => [
            { role: "user",      content: p.user.versions[p.user.currentIdx].content },
            { role: "assistant", content: p.ai.versions[p.ai.currentIdx].content },
          ]),
        { role: "user", content: text },
      ];
      const result = await chatAction({ messages: msgs });

      setConversations(prev => prev.map(c => {
        if (c.id !== finalCid) return c;
        const np = [...c.pairs];
        const i  = pairIndex !== undefined ? pairIndex : np.length - 1;
        np[i] = {
          ...np[i],
          ai: {
            ...np[i].ai,
            versions: np[i].ai.versions.map((v, vi) =>
              vi === np[i].ai.currentIdx ? { ...v, content: result } : v
            ),
          },
        };
        return { ...c, pairs: np, updatedAt: Date.now() };
      }));
    } catch {
      showToast("Neural link failed.", "error");
    } finally {
      setIsTyping(false);
    }
  };

  const panelClass = isFullscreen
    ? "fixed inset-0 z-[1000] bg-white flex flex-col"
    : "fixed right-6 bottom-20 w-[420px] h-[640px] z-[57] bg-white border-[4px] border-black flex flex-col shadow-[16px_16px_0px_black] ai-panel";

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-6 bottom-6 w-16 h-16 bg-[#1a1a1a] text-[#F9FF00] border-[4px] border-black flex items-center justify-center hover:bg-[#F9FF00] hover:text-black transition-all shadow-[6px_6px_0px_black] active:shadow-none active:translate-x-1 active:translate-y-1 group z-[56]"
        >
          <Bot size={28} className="group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {isOpen && (
        <div className={panelClass}>
          {/* Header */}
          <div className="bg-black text-white px-6 py-4 flex items-center justify-between border-b-[4px] border-black shrink-0 relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#F9FF00 1px, transparent 0)", backgroundSize: "16px 16px" }} />
             <div className="flex items-center gap-3 relative z-10 ai-header-item">
                <div className="w-10 h-10 border-[2px] border-[#F9FF00] bg-[#F9FF00]/10 flex items-center justify-center">
                   <Bot size={20} className="text-[#F9FF00]" />
                </div>
                <div>
                   <h3 className="font-oswald text-lg font-black uppercase tracking-widest leading-none">CLEF_AI</h3>
                   <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-1.5 h-1.5 bg-[#00FF87] rounded-full animate-pulse" />
                      <span className="font-mono text-[8px] text-[#00FF87] font-bold tracking-tighter">NEURAL_LINK_STABLE</span>
                   </div>
                </div>
             </div>
             <div className="flex items-center gap-2 relative z-10 ai-header-item">
                <button onClick={() => setShowHistory(!showHistory)} className="p-2 border-[2px] border-white/10 hover:border-[#F9FF00] hover:text-[#F9FF00] transition-all"><MessageSquare size={14} /></button>
                <button onClick={handleNewChat} className="p-2 border-[2px] border-white/10 hover:border-[#00FF87] hover:text-[#00FF87] transition-all"><Plus size={14} /></button>
                <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 border-[2px] border-white/10 hover:border-[#00E5FF] hover:text-[#00E5FF] transition-all hidden md:block">{isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}</button>
                <button onClick={() => setIsOpen(false)} className="p-2 border-[2px] border-white/10 hover:bg-[#FF0004] hover:border-[#FF0004] transition-all"><X size={14} /></button>
             </div>
          </div>

          {/* Messages */}
          <div ref={messagesRef} className="flex-1 overflow-y-auto bg-white p-6 space-y-8 custom-scrollbar relative">
             <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
             
             {pairs.length === 0 && (
               <div className="flex flex-col items-center justify-center h-full opacity-10 gap-6 select-none">
                  <Terminal size={48} />
                  <p className="font-oswald text-2xl font-black uppercase tracking-[0.4em] text-center">INITIALIZING<br />INTERFACE</p>
               </div>
             )}

             {pairs.map((pair, idx) => (
               <div key={pair.id} className="flex flex-col gap-6 animate-slide-up">
                  {/* User Message */}
                  <div className="flex justify-end">
                     <div className="max-w-[85%] bg-[#1a1a1a] text-white p-5 border-[3px] border-black shadow-[4px_4px_0px_rgba(0,0,0,0.3)] rounded-[32px] rounded-tr-sm">
                        <AIMarkdown content={pair.user.versions[pair.user.currentIdx].content} />
                     </div>
                  </div>
                  {/* AI Message */}
                  <div className="flex justify-start">
                     <div className={`max-w-[90%] p-6 border-[3px] border-black shadow-[6px_6px_0px_black] rounded-[32px] rounded-tl-sm transition-all ${pair.pinned ? "bg-[#F9FF00]/5 border-[#F9FF00]" : "bg-white"}`}>
                        <div className="flex items-center gap-3 mb-4 opacity-30">
                           <Cpu size={14} />
                           <span className="font-mono text-[8px] font-black tracking-widest uppercase">CORE_LLAMA_3.1_BUFFER</span>
                        </div>
                        {pair.ai.versions[pair.ai.currentIdx].content ? (
                          <div className="prose prose-sm prose-pre:bg-[#1a1a1a] prose-pre:border-[2px] prose-pre:border-black max-w-none">
                            <AIMarkdown content={pair.ai.versions[pair.ai.currentIdx].content} />
                          </div>
                        ) : isTyping && idx === pairs.length - 1 ? (
                          <div className="flex gap-2 py-2">
                             {[0,1,2].map(i => <div key={i} className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }} />)}
                          </div>
                        ) : null}

                        {pair.ai.versions[pair.ai.currentIdx].content && (
                          <div className="mt-6 flex items-center justify-between border-t-[2px] border-black/5 pt-4">
                             <div className="flex items-center gap-2">
                                <button onClick={() => { navigator.clipboard.writeText(pair.ai.versions[pair.ai.currentIdx].content); showToast("Copied.", "success"); }} className="p-2 border-[2px] border-black/10 hover:border-black transition-all rounded-lg"><Copy size={12} /></button>
                                <button onClick={() => togglePin(idx)} className={`p-2 border-[2px] transition-all rounded-lg ${pair.pinned ? "border-[#F9FF00] text-[#D97706] bg-[#F9FF00]/10" : "border-black/10 hover:border-black"}`}>{pair.pinned ? <PinOff size={12} /> : <Pin size={12} />}</button>
                             </div>
                             <div className="flex items-center gap-4">
                                <Activity size={10} className="text-black/20" />
                                <button onClick={() => handleSend(pair.user.versions[pair.user.currentIdx].content, idx)} className="font-oswald text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-[#00E5FF] transition-colors"><RotateCcw size={10} /> RE_GENERATE</button>
                             </div>
                          </div>
                        )}
                     </div>
                  </div>
               </div>
             ))}
          </div>

          {/* History Overlay */}
          {showHistory && (
             <div className="absolute inset-x-0 top-[76px] bottom-0 z-[100] bg-white border-t-[4px] border-black p-6 flex flex-col animate-slide-up">
                <div className="flex items-center justify-between mb-8">
                   <h4 className="font-oswald text-xl font-black uppercase tracking-widest flex items-center gap-3"><Terminal size={20} /> ARCHIVED_DATA</h4>
                   <button onClick={() => setShowHistory(false)} className="p-2 border-[3px] border-black hover:bg-black hover:text-white transition-all"><X size={16} /></button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                   {conversations.map(c => (
                     <div key={c.id} className="group border-[3px] border-black p-4 flex items-center justify-between hover:bg-[#F9FF00]/5 transition-all">
                        <div onClick={() => loadConversation(c.id)} className="flex-1 cursor-pointer">
                           <p className="font-inter text-[11px] font-bold uppercase truncate">{c.title}</p>
                           <p className="font-mono text-[8px] opacity-40 mt-1 uppercase">{new Date(c.updatedAt).toLocaleDateString()} // {c.pairs.length} BLOCKS</p>
                        </div>
                        <button onClick={() => deleteConversation(c.id)} className="opacity-0 group-hover:opacity-100 p-2 border-[2px] border-black hover:bg-[#FF0004] hover:text-white transition-all"><Trash2 size={12} /></button>
                     </div>
                   ))}
                </div>
             </div>
          )}

          {/* Input Area */}
          <div className="bg-black p-6 shrink-0 border-t-[4px] border-black relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F9FF00] px-4 py-1 border-[3px] border-black font-oswald text-[9px] font-black uppercase tracking-widest text-black">
                INPUT_READY
             </div>
             <div className="flex gap-4">
                <textarea
                  ref={textareaRef}
                  className="flex-1 bg-white border-[3px] border-black p-4 font-inter text-sm font-bold outline-none resize-none min-h-[60px] max-h-[140px] shadow-[4px_4px_0px_rgba(249,255,0,0.4)] focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all rounded-2xl"
                  placeholder="Transmit instructions..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                />
                <button
                  onClick={() => isTyping ? abortCtrl?.abort() : handleSend()}
                  className={`w-16 h-16 shrink-0 flex items-center justify-center border-[4px] border-black transition-all shadow-[6px_6px_0px_black] active:shadow-none active:translate-x-1 active:translate-y-1 rounded-2xl ${isTyping ? "bg-[#FF0004] text-white" : "bg-[#F9FF00] text-black"}`}
                >
                  {isTyping ? <StopCircle size={24} /> : <Send size={24} />}
                </button>
             </div>
             <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5">
                      <Sparkles size={10} className="text-[#F9FF00]" />
                      <span className="font-oswald text-[8px] font-black uppercase tracking-widest text-white/40">LLAMA_3.1</span>
                   </div>
                </div>
                <div className="font-mono text-[8px] font-bold text-white/20 uppercase tracking-tighter">
                   QUOTA: {stats.hour}/{limits.hour}H // {stats.day}/{limits.day}D
                </div>
             </div>
          </div>
        </div>
      )}
    </>
  );
}
