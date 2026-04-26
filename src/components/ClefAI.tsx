import { useState, useEffect, useRef } from "react";
import { 
  Send, Copy, ThumbsUp, ThumbsDown, Pin, PinOff, 
  RotateCcw, StopCircle, Bot, MessageSquare, Shield, X, Plus, Trash2
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
  user: { versions: MessageVersion[]; currentIdx: number; };
  ai: { versions: MessageVersion[]; currentIdx: number; };
  pinned: boolean;
  expanded: boolean;
  feedback?: 'up' | 'down' | null;
  stopped?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  pairs: MessagePair[];
  createdAt: number;
  updatedAt: number;
}

function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem("clef_conversations");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveConversations(convos: Conversation[]) {
  localStorage.setItem("clef_conversations", JSON.stringify(convos));
}

export function ClefAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [stats, setStats] = useState({ hour: 0, day: 0 });
  const { user } = useAuth();
  const { showToast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatAction = useAction(api.ai.chat);

  const isEmailUser = user && !user.isGuest;
  const limits = isEmailUser ? { hour: 20, day: 80 } : { hour: 10, day: 50 };

  const activeConvo = conversations.find(c => c.id === activeConvoId);
  const pairs = activeConvo?.pairs || [];

  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    updateStats();
  }, []);

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
    setActiveConvoId(null);
    setShowHistory(false);
  };

  const loadConversation = (id: string) => {
    setActiveConvoId(id);
    setShowHistory(false);
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConvoId === id) setActiveConvoId(null);
    showToast("Conversation deleted.", "info");
  };

  const updateActivePairs = (updater: (prev: MessagePair[]) => MessagePair[]) => {
    setConversations(prev => prev.map(c => {
      if (c.id !== activeConvoId) return c;
      return { ...c, pairs: updater(c.pairs), updatedAt: Date.now() };
    }));
  };

  const handleSend = async (customInput?: string, pairIndex?: number) => {
    const text = customInput || input;
    if (!text.trim() || isTyping) return;
    if (!checkRateLimit()) return;

    setIsTyping(true);
    if (!customInput) setInput("");

    let currentConvoId = activeConvoId;
    let currentPairs = [...pairs];

    if (!currentConvoId) {
      const newConvo: Conversation = {
        id: crypto.randomUUID(),
        title: text.slice(0, 50),
        pairs: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      currentConvoId = newConvo.id;
      setConversations(prev => [newConvo, ...prev]);
      setActiveConvoId(newConvo.id);
      currentPairs = [];
    }

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
        pinned: false, expanded: false, stopped: false
      };
      currentPairs.push(activePair);
    }

    const cid = currentConvoId;
    setConversations(prev => prev.map(c =>
      c.id === cid ? { ...c, pairs: currentPairs, updatedAt: Date.now() } : c
    ));

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

      setConversations(prev => prev.map(c => {
        if (c.id !== cid) return c;
        const newPairs = [...c.pairs];
        const idx = pairIndex !== undefined ? pairIndex : newPairs.length - 1;
        newPairs[idx] = { ...newPairs[idx], ai: { ...newPairs[idx].ai } };
        newPairs[idx].ai.versions = [...newPairs[idx].ai.versions];
        newPairs[idx].ai.versions[newPairs[idx].ai.currentIdx] = {
          ...newPairs[idx].ai.versions[newPairs[idx].ai.currentIdx],
          content: result
        };
        return { ...c, pairs: newPairs, updatedAt: Date.now() };
      }));
    } catch {
      showToast("AI Engine error. Please try again.", "error");
    } finally {
      setIsTyping(false);
      setAbortController(null);
    }
  };

  const handleStop = () => { if (abortController) abortController.abort(); };

  useEffect(() => {
    if (isOpen) setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [pairs, isTyping, isOpen]);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 md:w-16 md:h-16 bg-[#1a1a1a] text-white border-[3px] md:border-[4px] border-black flex items-center justify-center hover:bg-[#F9FF00] hover:text-black transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_rgba(0,0,0,1)] group"
        >
          <Bot size={24} className="shrink-0" />
          <div className="absolute right-full mr-4 px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
            Clef AI
          </div>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 z-[100] md:z-50 w-full h-full md:w-[380px] md:h-[580px] transition-all duration-300 flex flex-col border-[4px] border-black bg-white animate-slide-up overflow-hidden shadow-[8px_8px_0px_rgba(0,0,0,1)]">
          <div className="bg-[#1a1a1a] text-white px-4 md:px-6 py-3 flex items-center justify-between border-b-[4px] border-black shrink-0">
            <div className="flex items-center gap-3">
              <Bot size={24} className="shrink-0" />
              <span className="font-oswald text-base font-bold uppercase tracking-[0.2em] text-[#F9FF00]">Clef AI</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setShowHistory(!showHistory)} className={`p-1.5 transition-colors border-[2px] border-transparent hover:border-black ${showHistory ? 'bg-[#F9FF00] text-black' : 'hover:bg-[#F9FF00] hover:text-black'}`} title="Conversations"><MessageSquare size={14} /></button>
              <button onClick={handleNewChat} className="p-1.5 hover:bg-[#F9FF00] hover:text-black transition-colors border-[2px] border-transparent hover:border-black" title="New Chat"><Plus size={14} /></button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-[#FF0004] transition-colors border-[2px] border-transparent hover:border-black" title="Close"><X size={16} /></button>
            </div>
          </div>

          {showHistory && (
            <div className="absolute inset-x-0 top-[56px] bottom-0 z-[105] bg-white border-t-[3px] border-black flex flex-col p-4 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-oswald text-sm font-bold uppercase tracking-widest">CONVERSATIONS</h3>
                <button onClick={() => setShowHistory(false)} className="p-1 hover:bg-black hover:text-white border-[2px] border-black"><X size={14} /></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1.5">
                {conversations.length === 0 ? (
                  <p className="text-[10px] font-bold uppercase opacity-30 text-center mt-20">No conversations yet.</p>
                ) : (
                  conversations.sort((a, b) => b.updatedAt - a.updatedAt).map(c => (
                    <div 
                      key={c.id} 
                      className={`p-3 border-[2px] cursor-pointer group flex items-start justify-between gap-2 transition-colors ${c.id === activeConvoId ? 'border-[#F9FF00] bg-[#F9FF00]/10' : 'border-black hover:bg-[#fafafa]'}`}
                    >
                      <div className="flex-1 min-w-0" onClick={() => loadConversation(c.id)}>
                        <p className="font-inter text-[10px] font-bold truncate">{c.title}</p>
                        <p className="font-oswald text-[8px] opacity-40 uppercase mt-0.5">{c.pairs.length} messages • {new Date(c.updatedAt).toLocaleDateString()}</p>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteConversation(c.id); }} 
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

          <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#fafafa]">
            {pairs.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-20 select-none py-10 animate-fade-in">
                <Bot size={24} />
                <p className="font-oswald text-xl font-bold uppercase tracking-[0.2em] mt-6 text-center leading-tight">System Ready.<br />Awaiting Input.</p>
              </div>
            )}
            
            {pairs.map((pair, idx) => (
              <div key={pair.id} className="space-y-4 animate-fade-in">
                <div className="flex justify-end pl-8">
                  <div className="bg-[#F9FF00] border-[3px] border-black p-3 relative group shadow-[3px_3px_0px_rgba(0,0,0,1)] max-w-full">
                    <div className="font-inter text-[11px] font-medium whitespace-pre-wrap break-words">{pair.user.versions[pair.user.currentIdx].content}</div>
                  </div>
                </div>
                <div className="flex justify-start pr-6">
                  <div className={`border-[3px] border-black p-3 relative group w-full shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-colors ${pair.pinned ? "bg-[#f0f0f0]" : "bg-white"}`}>
                    <div className="font-inter text-[11px] leading-relaxed whitespace-pre-wrap break-words">
                      {pair.ai.versions[pair.ai.currentIdx].content || (isTyping && idx === pairs.length - 1 ? "..." : "")}
                    </div>
                    <div className="mt-2 flex items-center justify-between border-t border-black/10 pt-2">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { navigator.clipboard.writeText(pair.ai.versions[pair.ai.currentIdx].content); showToast("Copied!", "success"); }} className="hover:text-[#FF0004] p-0.5" title="Copy"><Copy size={11} /></button>
                        <button onClick={() => updateActivePairs(prev => { const n = [...prev]; n[idx] = { ...n[idx], pinned: !n[idx].pinned }; return n; })} className={`p-0.5 ${pair.pinned ? "text-[#FF0004]" : "hover:text-[#FF0004]"}`}>{pair.pinned ? <PinOff size={11} /> : <Pin size={11} />}</button>
                        <button onClick={() => updateActivePairs(prev => { const n = [...prev]; n[idx] = { ...n[idx], feedback: n[idx].feedback === 'up' ? null : 'up' }; return n; })} className={`p-0.5 ${pair.feedback === 'up' ? 'text-[#059669]' : 'hover:text-[#059669]'}`}><ThumbsUp size={11} /></button>
                        <button onClick={() => updateActivePairs(prev => { const n = [...prev]; n[idx] = { ...n[idx], feedback: n[idx].feedback === 'down' ? null : 'down' }; return n; })} className={`p-0.5 ${pair.feedback === 'down' ? 'text-[#FF0004]' : 'hover:text-[#FF0004]'}`}><ThumbsDown size={11} /></button>
                      </div>
                      <button onClick={() => handleSend(pair.user.versions[pair.user.currentIdx].content, idx)} className="hover:text-[#FF0004] p-0.5 flex items-center gap-1 font-oswald text-[8px] font-bold tracking-widest"><RotateCcw size={10} /> RETRY</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={scrollRef} className="h-2" />
          </div>

          <div className="p-3 border-t-[4px] border-black bg-white shrink-0">
            <div className="flex gap-2">
              <textarea
                className="flex-1 border-[3px] border-black p-3 font-inter text-xs font-medium outline-none resize-none focus:bg-[#F9FF00]/5 min-h-[44px] max-h-[100px] placeholder:text-black/30"
                placeholder="INPUT COMMAND..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              />
              <button 
                onClick={() => isTyping ? handleStop() : handleSend()} 
                className={`w-12 ${isTyping ? "bg-[#FF0004]" : "bg-[#F9FF00]"} border-[3px] border-black hover:bg-black hover:text-white transition-all flex items-center justify-center shadow-[3px_3px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 shrink-0`}
              >
                {isTyping ? <StopCircle size={18} /> : <Send size={18} />}
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-[8px] font-bold uppercase text-black/40 tracking-[0.15em] flex items-center gap-1"><Shield size={9} /> Clef Engine • Llama 3.1</p>
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
