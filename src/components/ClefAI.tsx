import { useState, useEffect, useRef } from "react";
import {
  Send, Copy, ThumbsUp, ThumbsDown, Pin, PinOff,
  RotateCcw, StopCircle, Bot, MessageSquare, Shield, X, Plus, Trash2,
  Maximize2, Minimize2,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AIMarkdown } from "@/components/AIMarkdown";

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
  const [isOpen,         setIsOpen]         = useState(false);
  const [isFullscreen,   setIsFullscreen]   = useState(false);
  const [conversations,  setConversations]  = useState<Conversation[]>(loadConversations);
  const [activeConvoId,  setActiveConvoId]  = useState<string | null>(null);
  const [showHistory,    setShowHistory]    = useState(false);
  const [input,          setInput]          = useState("");
  const [isTyping,       setIsTyping]       = useState(false);
  const [abortCtrl,      setAbortCtrl]      = useState<AbortController | null>(null);
  const [stats,          setStats]          = useState({ hour: 0, day: 0 });

  const { user }       = useAuth();
  const { showToast }  = useToast();
  const scrollRef      = useRef<HTMLDivElement>(null);
  const chatAction     = useAction(api.ai.chat);

  const isEmailUser = user && !user.isGuest;
  const limits      = isEmailUser ? { hour: 20, day: 80 } : { hour: 10, day: 50 };
  const activeConvo = conversations.find(c => c.id === activeConvoId);
  const pairs       = activeConvo?.pairs || [];

  // Pinned messages (shown at top of chat)
  const pinnedPairs = pairs.filter(p => p.pinned);

  useEffect(() => { saveConversations(conversations); }, [conversations]);
  useEffect(() => { updateStats(); }, []);

  function updateStats() {
    const now = Date.now();
    const logs = JSON.parse(localStorage.getItem("clef_chat_logs") || "[]");
    setStats({
      hour: logs.filter((t: number) => now - t < 3_600_000).length,
      day:  logs.filter((t: number) => now - t < 86_400_000).length,
    });
  }

  function checkRateLimit() {
    const now  = Date.now();
    const logs = JSON.parse(localStorage.getItem("clef_chat_logs") || "[]");
    const hr   = logs.filter((t: number) => now - t < 3_600_000);
    const day  = logs.filter((t: number) => now - t < 86_400_000);
    if (hr.length  >= limits.hour) { showToast(`Hourly limit (${limits.hour}).`, "error"); return false; }
    if (day.length >= limits.day)  { showToast(`Daily limit (${limits.day}).`,   "error"); return false; }
    localStorage.setItem("clef_chat_logs", JSON.stringify([...day, now]));
    setStats({ hour: hr.length + 1, day: day.length + 1 });
    return true;
  }

  const handleNewChat    = () => { setActiveConvoId(null); setShowHistory(false); };
  const loadConversation = (id: string) => { setActiveConvoId(id); setShowHistory(false); };
  const deleteConversation = (id: string) => {
    setConversations(p => p.filter(c => c.id !== id));
    if (activeConvoId === id) setActiveConvoId(null);
    showToast("Deleted.", "info");
  };

  const updateActivePairs = (fn: (p: MessagePair[]) => MessagePair[]) => {
    setConversations(prev => prev.map(c =>
      c.id !== activeConvoId ? c : { ...c, pairs: fn(c.pairs), updatedAt: Date.now() }
    ));
  };

  // ── Toggle pin (fixed: uses functional update so state is always fresh) ──
  const togglePin = (idx: number) => {
    updateActivePairs(prev => {
      const next = prev.map((p, i) => i === idx ? { ...p, pinned: !p.pinned } : p);
      return next;
    });
  };

  const handleSend = async (customInput?: string, pairIndex?: number) => {
    const text = customInput || input;
    if (!text.trim() || isTyping) return;
    if (!checkRateLimit()) return;

    setIsTyping(true);
    if (!customInput) setInput("");

    let cid   = activeConvoId;
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

    const ctrl = new AbortController();
    setAbortCtrl(ctrl);

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
      showToast("AI Engine error. Try again.", "error");
    } finally {
      setIsTyping(false);
      setAbortCtrl(null);
    }
  };

  const handleStop = () => { abortCtrl?.abort(); };

  useEffect(() => {
    if (isOpen) setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [pairs, isTyping, isOpen]);

  // ── Panel sizing ──
  const panelClass = isFullscreen
    ? "fixed inset-0 z-[200]"
    : "fixed inset-0 md:inset-auto md:right-6 z-[100] md:z-[57] w-full h-full md:w-[420px] md:h-[600px]";
  const panelStyle = isFullscreen
    ? {}
    : { bottom: "calc(40px + 12px)" };

  return (
    <>
      {/* FAB */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-4 md:right-6 z-[56] w-14 h-14 md:w-16 md:h-16 bg-[#1a1a1a] text-white border-[3px] md:border-[4px] border-black flex items-center justify-center hover:bg-[#F9FF00] hover:text-black transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_rgba(0,0,0,1)] group"
          style={{ bottom: "calc(40px + 12px)" }}
        >
          <Bot size={24} className="shrink-0" />
          <div className="absolute right-full mr-4 px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
            Clef AI
          </div>
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div
          className={`${panelClass} flex flex-col border-[4px] border-black bg-white animate-slide-up overflow-hidden shadow-[8px_8px_0px_rgba(0,0,0,1)]`}
          style={panelStyle}
        >
          {/* Header */}
          <div className="bg-[#1a1a1a] text-white px-4 md:px-5 py-3 flex items-center justify-between border-b-[4px] border-black shrink-0">
            <div className="flex items-center gap-3">
              <Bot size={20} className="shrink-0 text-[#F9FF00]" />
              <span className="font-oswald text-sm font-bold uppercase tracking-[0.2em] text-[#F9FF00]">Clef AI</span>
              {pinnedPairs.length > 0 && (
                <span className="bg-[#F9FF00] text-black font-oswald text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
                  {pinnedPairs.length} PINNED
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`p-1.5 transition-colors border-[2px] border-transparent hover:border-black ${showHistory ? "bg-[#F9FF00] text-black" : "hover:bg-[#F9FF00] hover:text-black"}`}
                title="Conversations"
              >
                <MessageSquare size={13} />
              </button>
              <button
                onClick={handleNewChat}
                className="p-1.5 hover:bg-[#F9FF00] hover:text-black transition-colors border-[2px] border-transparent hover:border-black"
                title="New Chat"
              >
                <Plus size={13} />
              </button>
              <button
                onClick={() => setIsFullscreen(f => !f)}
                className="p-1.5 hover:bg-[#00E5FF] hover:text-black transition-colors border-[2px] border-transparent hover:border-black hidden md:flex"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </button>
              <button
                onClick={() => { setIsOpen(false); setIsFullscreen(false); }}
                className="p-1.5 hover:bg-[#FF0004] transition-colors border-[2px] border-transparent hover:border-black"
                title="Close"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Pinned messages strip */}
          {pinnedPairs.length > 0 && !showHistory && (
            <div className="bg-[#F9FF00]/10 border-b-[3px] border-black px-4 py-2 shrink-0">
              <p className="font-oswald text-[9px] font-bold uppercase tracking-widest text-black/40 mb-1.5">
                PINNED
              </p>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {pinnedPairs.map((p, i) => (
                  <div key={p.id} className="flex items-start gap-2 bg-white border-[2px] border-black/10 px-2 py-1">
                    <Pin size={9} className="text-[#FF0004] shrink-0 mt-0.5" />
                    <p className="font-inter text-[9px] text-black/70 line-clamp-2 flex-1">
                      {p.ai.versions[p.ai.currentIdx].content.slice(0, 120)}…
                    </p>
                    <button
                      onClick={() => {
                        const realIdx = pairs.findIndex(pp => pp.id === p.id);
                        if (realIdx !== -1) togglePin(realIdx);
                      }}
                      className="shrink-0 hover:text-[#FF0004] transition-colors"
                    >
                      <X size={9} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History panel */}
          {showHistory && (
            <div className="absolute inset-x-0 top-[52px] bottom-0 z-[105] bg-white border-t-[3px] border-black flex flex-col p-4 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-oswald text-sm font-bold uppercase tracking-widest">CONVERSATIONS</h3>
                <button onClick={() => setShowHistory(false)} className="p-1 hover:bg-black hover:text-white border-[2px] border-black">
                  <X size={13} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1.5">
                {conversations.length === 0 ? (
                  <p className="text-[10px] font-bold uppercase opacity-30 text-center mt-20">No conversations yet.</p>
                ) : (
                  [...conversations]
                    .sort((a, b) => b.updatedAt - a.updatedAt)
                    .map(c => (
                      <div
                        key={c.id}
                        className={`p-3 border-[2px] cursor-pointer group flex items-start justify-between gap-2 transition-colors ${
                          c.id === activeConvoId ? "border-[#F9FF00] bg-[#F9FF00]/10" : "border-black hover:bg-[#fafafa]"
                        }`}
                      >
                        <div className="flex-1 min-w-0" onClick={() => loadConversation(c.id)}>
                          <p className="font-inter text-[10px] font-bold truncate">{c.title}</p>
                          <p className="font-oswald text-[8px] opacity-40 uppercase mt-0.5">
                            {c.pairs.length} msgs • {new Date(c.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); deleteConversation(c.id); }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#FF0004] hover:text-white border-[2px] border-black transition-all shrink-0"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-5 bg-[#fafafa] ${isFullscreen ? "max-w-4xl mx-auto w-full" : ""}`}>
            {pairs.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-20 select-none py-10 animate-fade-in">
                <Bot size={28} />
                <p className="font-oswald text-xl font-bold uppercase tracking-[0.2em] mt-6 text-center leading-tight">
                  System Ready.<br />Awaiting Input.
                </p>
                <p className="font-inter text-[9px] uppercase tracking-widest mt-3 opacity-60">
                  Supports Markdown & LaTeX
                </p>
              </div>
            )}

            {pairs.map((pair, idx) => (
              <div key={pair.id} className="space-y-3 animate-fade-in">
                {/* User message */}
                <div className="flex justify-end pl-8">
                  <div className="bg-[#F9FF00] border-[3px] border-black p-3 shadow-[3px_3px_0px_rgba(0,0,0,1)] max-w-[85%]">
                    <p className="font-inter text-[11px] font-medium whitespace-pre-wrap break-words">
                      {pair.user.versions[pair.user.currentIdx].content}
                    </p>
                  </div>
                </div>

                {/* AI message */}
                <div className="flex justify-start pr-4">
                  <div
                    className={`border-[3px] border-black p-3 w-full shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-colors ${
                      pair.pinned ? "bg-[#F9FF00]/8 border-l-[4px] border-l-[#F9FF00]" : "bg-white"
                    }`}
                  >
                    {/* AI content with markdown */}
                    {pair.ai.versions[pair.ai.currentIdx].content ? (
                      <AIMarkdown content={pair.ai.versions[pair.ai.currentIdx].content} />
                    ) : (
                      isTyping && idx === pairs.length - 1 ? (
                        <div className="flex items-center gap-1.5 py-1">
                          {[0, 1, 2].map(i => (
                            <div
                              key={i}
                              className="w-1.5 h-1.5 bg-black/30 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.15}s` }}
                            />
                          ))}
                        </div>
                      ) : null
                    )}

                    {/* Action bar */}
                    <div className="mt-2 flex items-center justify-between border-t border-black/10 pt-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => { navigator.clipboard.writeText(pair.ai.versions[pair.ai.currentIdx].content); showToast("Copied!", "success"); }}
                          className="hover:text-[#FF0004] p-0.5 transition-colors"
                          title="Copy"
                        >
                          <Copy size={11} />
                        </button>
                        <button
                          onClick={() => togglePin(idx)}
                          className={`p-0.5 transition-colors ${pair.pinned ? "text-[#FF0004]" : "hover:text-[#FF0004]"}`}
                          title={pair.pinned ? "Unpin" : "Pin"}
                        >
                          {pair.pinned ? <PinOff size={11} /> : <Pin size={11} />}
                        </button>
                        <button
                          onClick={() => updateActivePairs(prev => prev.map((p, i) => i === idx ? { ...p, feedback: p.feedback === "up" ? null : "up" } : p))}
                          className={`p-0.5 transition-colors ${pair.feedback === "up" ? "text-[#059669]" : "hover:text-[#059669]"}`}
                        >
                          <ThumbsUp size={11} />
                        </button>
                        <button
                          onClick={() => updateActivePairs(prev => prev.map((p, i) => i === idx ? { ...p, feedback: p.feedback === "down" ? null : "down" } : p))}
                          className={`p-0.5 transition-colors ${pair.feedback === "down" ? "text-[#FF0004]" : "hover:text-[#FF0004]"}`}
                        >
                          <ThumbsDown size={11} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleSend(pair.user.versions[pair.user.currentIdx].content, idx)}
                        className="hover:text-[#FF0004] p-0.5 flex items-center gap-1 font-oswald text-[8px] font-bold tracking-widest transition-colors"
                      >
                        <RotateCcw size={10} /> RETRY
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={scrollRef} className="h-2" />
          </div>

          {/* Input */}
          <div className={`p-3 border-t-[4px] border-black bg-white shrink-0 ${isFullscreen ? "max-w-4xl mx-auto w-full" : ""}`}>
            <div className="flex gap-2">
              <textarea
                className="flex-1 border-[3px] border-black p-3 font-inter text-xs font-medium outline-none resize-none focus:bg-[#F9FF00]/5 min-h-[44px] max-h-[120px] placeholder:text-black/30"
                placeholder="Ask anything… supports Markdown & LaTeX"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              />
              <button
                onClick={() => isTyping ? handleStop() : handleSend()}
                className={`w-12 ${isTyping ? "bg-[#FF0004]" : "bg-[#F9FF00]"} border-[3px] border-black hover:bg-black hover:text-white transition-all flex items-center justify-center shadow-[3px_3px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 shrink-0`}
              >
                {isTyping ? <StopCircle size={18} /> : <Send size={18} />}
              </button>
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-[8px] font-bold uppercase text-black/40 tracking-[0.15em] flex items-center gap-1">
                <Shield size={8} /> Clef Engine • Llama 3.1 • MD+LaTeX
              </p>
              <p className="text-[8px] font-bold uppercase text-black/40 tracking-[0.15em]">
                {stats.hour}/{limits.hour} HR • {stats.day}/{limits.day} DAY
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
