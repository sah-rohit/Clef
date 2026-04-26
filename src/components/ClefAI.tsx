import { useState, useEffect, useRef, useCallback } from "react";
import {
  Send, Copy, ThumbsUp, ThumbsDown, Pin, PinOff,
  RotateCcw, StopCircle, Bot, MessageSquare, Shield, X, Plus, Trash2,
  Maximize2, Minimize2, Bold, Italic, Highlighter, Type,
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

// Wrap selected text in textarea with markdown syntax
function wrapSelection(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  value: string,
  setValue: (v: string) => void
) {
  const start = textarea.selectionStart;
  const end   = textarea.selectionEnd;
  const sel   = value.slice(start, end);
  const newVal = value.slice(0, start) + before + sel + after + value.slice(end);
  setValue(newVal);
  // Restore cursor after React re-render
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(start + before.length, end + before.length);
  });
}

export function ClefAI() {
  const [isOpen,        setIsOpen]        = useState(false);
  const [isFullscreen,  setIsFullscreen]  = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [showHistory,   setShowHistory]   = useState(false);
  const [input,         setInput]         = useState("");
  const [isTyping,      setIsTyping]      = useState(false);
  const [abortCtrl,     setAbortCtrl]     = useState<AbortController | null>(null);
  const [stats,         setStats]         = useState({ hour: 0, day: 0 });
  const [showColorPicker, setShowColorPicker] = useState(false);

  const { user }      = useAuth();
  const { showToast } = useToast();
  const messagesRef   = useRef<HTMLDivElement>(null);
  const textareaRef   = useRef<HTMLTextAreaElement>(null);
  const chatAction    = useAction(api.ai.chat);

  const isEmailUser = user && !user.isGuest;
  const limits      = isEmailUser ? { hour: 20, day: 80 } : { hour: 10, day: 50 };
  const activeConvo = conversations.find(c => c.id === activeConvoId);
  const pairs       = activeConvo?.pairs || [];
  const pinnedPairs = pairs.filter(p => p.pinned);

  useEffect(() => { saveConversations(conversations); }, [conversations]);
  useEffect(() => { updateStats(); }, []);

  // Auto-scroll to bottom whenever pairs or typing state changes
  const scrollToBottom = useCallback(() => {
    const el = messagesRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, []);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [pairs, isTyping, isOpen, scrollToBottom]);

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

  const togglePin = (idx: number) => {
    updateActivePairs(prev => prev.map((p, i) => i === idx ? { ...p, pinned: !p.pinned } : p));
  };

  // Formatting helpers
  const fmt = (before: string, after: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    wrapSelection(ta, before, after, input, setInput);
  };

  const insertColor = (color: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end   = ta.selectionEnd;
    const sel   = input.slice(start, end) || "text";
    // Use HTML span for color (markdown doesn't support color natively)
    const tag = `<span style="color:${color}">${sel}</span>`;
    const newVal = input.slice(0, start) + tag + input.slice(end);
    setInput(newVal);
    setShowColorPicker(false);
  };

  const handleSend = async (customInput?: string, pairIndex?: number) => {
    const text = customInput || input;
    if (!text.trim() || isTyping) return;
    if (!checkRateLimit()) return;

    setIsTyping(true);
    if (!customInput) setInput("");

    let cid    = activeConvoId;
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

  // ── Panel dimensions ──────────────────────────────────────────────────────
  // Fullscreen: covers entire viewport
  // Normal: fixed bottom-right panel
  const panelPositionClass = isFullscreen
    ? "fixed inset-0 z-[200]"
    : "fixed inset-0 md:inset-auto md:right-6 z-[100] md:z-[57] w-full h-full md:w-[440px] md:h-[620px]";
  const panelBottomStyle = isFullscreen ? {} : { bottom: "calc(40px + 12px)" };

  const COLORS = ["#FF0004", "#F9FF00", "#00E5FF", "#00FF87", "#7C3AED", "#FF6B00", "#1a1a1a"];

  return (
    <>
      {/* ── FAB ── */}
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

      {/* ── Chat panel ── */}
      {isOpen && (
        <div
          className={`${panelPositionClass} flex flex-col border-[4px] border-black bg-white animate-slide-up overflow-hidden shadow-[8px_8px_0px_rgba(0,0,0,1)]`}
          style={panelBottomStyle}
        >

          {/* Header */}
          <div className="bg-[#1a1a1a] text-white px-4 py-2.5 flex items-center justify-between border-b-[4px] border-black shrink-0">
            <div className="flex items-center gap-2.5">
              <Bot size={18} className="shrink-0 text-[#F9FF00]" />
              <span className="font-oswald text-sm font-bold uppercase tracking-[0.2em] text-[#F9FF00]">Clef AI</span>
              {pinnedPairs.length > 0 && (
                <span className="bg-[#F9FF00] text-black font-oswald text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
                  {pinnedPairs.length} PINNED
                </span>
              )}
            </div>
            <div className="flex items-center gap-0.5">
              <button onClick={() => setShowHistory(!showHistory)}
                className={`p-1.5 transition-colors border-[2px] border-transparent hover:border-black/30 ${showHistory ? "bg-[#F9FF00] text-black" : "hover:bg-white/10"}`}
                title="Conversations">
                <MessageSquare size={13} />
              </button>
              <button onClick={handleNewChat}
                className="p-1.5 hover:bg-white/10 transition-colors border-[2px] border-transparent hover:border-black/30"
                title="New Chat">
                <Plus size={13} />
              </button>
              <button onClick={() => setIsFullscreen(f => !f)}
                className="p-1.5 hover:bg-[#00E5FF]/20 hover:text-[#00E5FF] transition-colors border-[2px] border-transparent hover:border-[#00E5FF]/30 hidden md:flex items-center"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
                {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </button>
              <button onClick={() => { setIsOpen(false); setIsFullscreen(false); }}
                className="p-1.5 hover:bg-[#FF0004] transition-colors border-[2px] border-transparent hover:border-[#FF0004]"
                title="Close">
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Pinned strip */}
          {pinnedPairs.length > 0 && !showHistory && (
            <div className="bg-[#F9FF00]/10 border-b-[2px] border-black/20 px-3 py-2 shrink-0">
              <p className="font-oswald text-[8px] font-bold uppercase tracking-widest text-black/40 mb-1">PINNED</p>
              <div className="space-y-1 max-h-20 overflow-y-auto ai-scroll">
                {pinnedPairs.map(p => (
                  <div key={p.id} className="flex items-start gap-2 bg-white border border-black/10 px-2 py-1">
                    <Pin size={8} className="text-[#FF0004] shrink-0 mt-0.5" />
                    <p className="font-inter text-[9px] text-black/70 line-clamp-1 flex-1">
                      {p.ai.versions[p.ai.currentIdx].content.slice(0, 100)}…
                    </p>
                    <button onClick={() => { const i = pairs.findIndex(pp => pp.id === p.id); if (i !== -1) togglePin(i); }}
                      className="shrink-0 hover:text-[#FF0004] transition-colors">
                      <X size={8} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History overlay */}
          {showHistory && (
            <div className="absolute inset-x-0 top-[48px] bottom-0 z-[105] bg-white border-t-[3px] border-black flex flex-col p-4 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-oswald text-sm font-bold uppercase tracking-widest">CONVERSATIONS</h3>
                <button onClick={() => setShowHistory(false)} className="p-1 hover:bg-black hover:text-white border-[2px] border-black">
                  <X size={13} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1.5 ai-scroll">
                {conversations.length === 0 ? (
                  <p className="text-[10px] font-bold uppercase opacity-30 text-center mt-20">No conversations yet.</p>
                ) : (
                  [...conversations].sort((a, b) => b.updatedAt - a.updatedAt).map(c => (
                    <div key={c.id}
                      className={`p-3 border-[2px] cursor-pointer group flex items-start justify-between gap-2 transition-colors ${
                        c.id === activeConvoId ? "border-[#F9FF00] bg-[#F9FF00]/10" : "border-black hover:bg-[#fafafa]"
                      }`}>
                      <div className="flex-1 min-w-0" onClick={() => loadConversation(c.id)}>
                        <p className="font-inter text-[10px] font-bold truncate">{c.title}</p>
                        <p className="font-oswald text-[8px] opacity-40 uppercase mt-0.5">
                          {c.pairs.length} msgs • {new Date(c.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button onClick={e => { e.stopPropagation(); deleteConversation(c.id); }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#FF0004] hover:text-white border-[2px] border-black transition-all shrink-0">
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ── Messages area ── */}
          <div
            ref={messagesRef}
            className={`flex-1 overflow-y-auto ai-scroll bg-[#fafafa] ${isFullscreen ? "flex flex-col" : ""}`}
          >
            <div className={`p-4 space-y-4 ${isFullscreen ? "max-w-3xl mx-auto w-full flex-1" : ""}`}>
              {pairs.length === 0 && (
                <div className="flex flex-col items-center justify-center min-h-[200px] opacity-20 select-none animate-fade-in">
                  <Bot size={28} />
                  <p className="font-oswald text-lg font-bold uppercase tracking-[0.2em] mt-4 text-center leading-tight">
                    System Ready.<br />Awaiting Input.
                  </p>
                  <p className="font-inter text-[9px] uppercase tracking-widest mt-2 opacity-60">
                    Markdown • LaTeX • Code highlighting
                  </p>
                </div>
              )}

              {pairs.map((pair, idx) => (
                <div key={pair.id} className="space-y-2 animate-fade-in">
                  {/* User bubble */}
                  <div className="flex justify-end">
                    <div className="bg-[#F9FF00] border-[3px] border-black p-3 shadow-[3px_3px_0px_rgba(0,0,0,1)] max-w-[85%]">
                      <p className="font-inter text-[11px] font-medium whitespace-pre-wrap break-words">
                        {pair.user.versions[pair.user.currentIdx].content}
                      </p>
                    </div>
                  </div>

                  {/* AI bubble */}
                  <div className="flex justify-start">
                    <div className={`border-[3px] border-black p-3 w-full shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-colors ${
                      pair.pinned
                        ? "bg-white border-l-[4px] border-l-[#F9FF00]"
                        : "bg-white"
                    }`}>
                      {pair.ai.versions[pair.ai.currentIdx].content ? (
                        <AIMarkdown content={pair.ai.versions[pair.ai.currentIdx].content} />
                      ) : isTyping && idx === pairs.length - 1 ? (
                        <div className="flex items-center gap-1.5 py-1">
                          {[0, 1, 2].map(i => (
                            <div key={i} className="w-1.5 h-1.5 bg-black/30 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.15}s` }} />
                          ))}
                        </div>
                      ) : null}

                      {/* Action bar — only show when there's content */}
                      {pair.ai.versions[pair.ai.currentIdx].content && (
                        <div className="mt-2 flex items-center justify-between border-t border-black/10 pt-1.5">
                          <div className="flex items-center gap-1">
                            <button onClick={() => { navigator.clipboard.writeText(pair.ai.versions[pair.ai.currentIdx].content); showToast("Copied!", "success"); }}
                              className="hover:text-[#FF0004] p-0.5 transition-colors" title="Copy">
                              <Copy size={10} />
                            </button>
                            <button onClick={() => togglePin(idx)}
                              className={`p-0.5 transition-colors ${pair.pinned ? "text-[#FF0004]" : "hover:text-[#FF0004]"}`}
                              title={pair.pinned ? "Unpin" : "Pin"}>
                              {pair.pinned ? <PinOff size={10} /> : <Pin size={10} />}
                            </button>
                            <button onClick={() => updateActivePairs(prev => prev.map((p, i) => i === idx ? { ...p, feedback: p.feedback === "up" ? null : "up" } : p))}
                              className={`p-0.5 transition-colors ${pair.feedback === "up" ? "text-[#059669]" : "hover:text-[#059669]"}`}>
                              <ThumbsUp size={10} />
                            </button>
                            <button onClick={() => updateActivePairs(prev => prev.map((p, i) => i === idx ? { ...p, feedback: p.feedback === "down" ? null : "down" } : p))}
                              className={`p-0.5 transition-colors ${pair.feedback === "down" ? "text-[#FF0004]" : "hover:text-[#FF0004]"}`}>
                              <ThumbsDown size={10} />
                            </button>
                          </div>
                          <button onClick={() => handleSend(pair.user.versions[pair.user.currentIdx].content, idx)}
                            className="hover:text-[#FF0004] p-0.5 flex items-center gap-1 font-oswald text-[8px] font-bold tracking-widest transition-colors">
                            <RotateCcw size={9} /> RETRY
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Input area ── */}
          <div className={`border-t-[4px] border-black bg-white shrink-0 ${isFullscreen ? "flex flex-col items-center" : ""}`}>
            <div className={`${isFullscreen ? "w-full max-w-3xl" : "w-full"} p-3`}>

              {/* Formatting toolbar */}
              <div className="flex items-center gap-0 border-[2px] border-black mb-2 w-fit">
                <button onClick={() => fmt("**", "**")}
                  className="p-1.5 border-r-[2px] border-black hover:bg-[#F9FF00] transition-colors" title="Bold">
                  <Bold size={11} />
                </button>
                <button onClick={() => fmt("*", "*")}
                  className="p-1.5 border-r-[2px] border-black hover:bg-[#F9FF00] transition-colors" title="Italic">
                  <Italic size={11} />
                </button>
                <button onClick={() => fmt("==", "==")}
                  className="p-1.5 border-r-[2px] border-black hover:bg-[#F9FF00] transition-colors" title="Highlight">
                  <Highlighter size={11} />
                </button>
                <button onClick={() => fmt("`", "`")}
                  className="p-1.5 border-r-[2px] border-black hover:bg-[#7C3AED]/20 transition-colors font-mono text-[10px] font-bold" title="Inline code">
                  {"</>"}
                </button>
                <button onClick={() => fmt("$", "$")}
                  className="p-1.5 border-r-[2px] border-black hover:bg-[#00E5FF]/20 transition-colors font-mono text-[10px] font-bold" title="LaTeX math">
                  ∑
                </button>
                {/* Color picker */}
                <div className="relative">
                  <button onClick={() => setShowColorPicker(s => !s)}
                    className="p-1.5 hover:bg-[#F9FF00] transition-colors flex items-center gap-1" title="Text color">
                    <Type size={11} />
                    <span className="w-2 h-2 rounded-full bg-[#FF0004]" />
                  </button>
                  {showColorPicker && (
                    <div className="absolute bottom-full left-0 mb-1 flex gap-1 bg-white border-[2px] border-black p-1.5 shadow-[4px_4px_0px_rgba(0,0,0,1)] z-10">
                      {COLORS.map(c => (
                        <button key={c} onClick={() => insertColor(c)}
                          className="w-5 h-5 border-[2px] border-black hover:scale-110 transition-transform"
                          style={{ background: c }} title={c} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Textarea + send */}
              <div className="flex gap-2">
                <textarea
                  ref={textareaRef}
                  className="flex-1 border-[3px] border-black p-2.5 font-inter text-xs font-medium outline-none resize-none focus:bg-[#F9FF00]/5 min-h-[44px] max-h-[140px] placeholder:text-black/30 ai-scroll"
                  placeholder="Ask anything… Markdown, LaTeX, code supported"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                />
                <button
                  onClick={() => isTyping ? handleStop() : handleSend()}
                  className={`w-11 shrink-0 ${isTyping ? "bg-[#FF0004]" : "bg-[#F9FF00]"} border-[3px] border-black hover:bg-black hover:text-white transition-all flex items-center justify-center shadow-[3px_3px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5`}
                >
                  {isTyping ? <StopCircle size={16} /> : <Send size={16} />}
                </button>
              </div>

              {/* Footer info */}
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-[8px] font-bold uppercase text-black/35 tracking-[0.12em] flex items-center gap-1">
                  <Shield size={8} /> Llama 3.1 • MD+LaTeX
                </p>
                <p className="text-[8px] font-bold uppercase text-black/35 tracking-[0.12em]">
                  {stats.hour}/{limits.hour}h • {stats.day}/{limits.day}d
                </p>
              </div>
            </div>
          </div>

        </div>
      )}
    </>
  );
}
