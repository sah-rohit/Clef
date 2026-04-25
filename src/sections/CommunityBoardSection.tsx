import { useState, useEffect } from "react";
import { Send, MessageSquare, Heart, Shield, HelpCircle, MapPin, Mail, Sparkles } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

type BoardTab = "FEEDBACK" | "EXPERIENCE" | "CONTACT";

interface Post {
  id: string;
  type: BoardTab;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
}

export function CommunityBoardSection() {
  const [activeTab, setActiveTab] = useState<BoardTab>("FEEDBACK");
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Anonymous");
  const { showToast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("clef_community_posts");
    if (saved) {
      setPosts(JSON.parse(saved));
    } else {
      // Seed initial posts
      const initial: Post[] = [
        { id: "1", type: "EXPERIENCE", author: "DevPro", content: "The JSON formatter is insanely fast. Best I've used.", timestamp: new Date().toISOString(), likes: 12 },
        { id: "2", type: "FEEDBACK", author: "CreativeAria", content: "Would love to see a SVG optimizer tool added next!", timestamp: new Date().toISOString(), likes: 8 },
        { id: "3", type: "EXPERIENCE", author: "GuestResident", content: "Clef AI helped me debug a complex regex in seconds. 10/10.", timestamp: new Date().toISOString(), likes: 15 },
      ];
      setPosts(initial);
      localStorage.setItem("clef_community_posts", JSON.stringify(initial));
    }
  }, []);

  const handlePost = () => {
    if (!content.trim()) return;

    // Daily limit check
    const today = new Date().toISOString().split("T")[0];
    const dailyPosts = JSON.parse(localStorage.getItem(`clef_posts_${today}`) || "0");
    if (dailyPosts >= 5) {
      showToast("Daily limit reached (5 posts). Let's keep it clean!", "warning");
      return;
    }

    const newPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      type: activeTab,
      author: author.trim() || "Anonymous",
      content: content.trim(),
      timestamp: new Date().toISOString(),
      likes: 0
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem("clef_community_posts", JSON.stringify(updated));
    localStorage.setItem(`clef_posts_${today}`, JSON.stringify(dailyPosts + 1));
    
    setContent("");
    showToast("Post shared with the community!", "success");
  };

  const handleLike = (id: string) => {
    const updated = posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p);
    setPosts(updated);
    localStorage.setItem("clef_community_posts", JSON.stringify(updated));
  };

  return (
    <section id="community" className="py-20 px-6 md:px-12 bg-white border-t-[4px] border-black overflow-hidden">
      <div className="max-w-[1300px] mx-auto">
        <div className="mb-12">
          <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF0004] block mb-2">COMMUNITY TALK</span>
          <h2 className="font-oswald text-6xl font-bold uppercase tracking-tighter">CONTACT US.</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 border-[4px] border-black">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3 border-r-[4px] border-black p-0 bg-[#fafafa]">
            <div className="p-8 border-b-[4px] border-black">
              <h3 className="font-oswald text-sm font-bold uppercase mb-4 tracking-wider">BOARD CATEGORIES</h3>
              <p className="font-inter text-[10px] text-black/50 leading-relaxed uppercase tracking-tight">
                No account needed. Share your thoughts, report bugs, or just say hi.
              </p>
            </div>

            <div className="flex flex-col">
              {(["FEEDBACK", "EXPERIENCE", "CONTACT"] as BoardTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-8 py-6 font-oswald text-[11px] font-bold uppercase tracking-[0.2em] border-b-[4px] border-black last:border-b-0 transition-all ${
                    activeTab === tab ? "bg-[#F9FF00] text-black" : "bg-white hover:bg-[#F9FF00]/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {tab}
                    {activeTab === tab && <Sparkles size={14} />}
                  </div>
                </button>
              ))}
            </div>

            <div className="p-8 bg-[#1a1a1a] text-white">
              <h4 className="font-oswald text-[10px] font-bold uppercase mb-4 tracking-[0.2em] text-[#F9FF00]">COMMUNITY PROTOCOL</h4>
              <ul className="space-y-6">
                <li className="flex gap-3">
                  <Shield size={16} className="shrink-0 text-[#FF0004]" />
                  <div>
                    <p className="font-oswald text-[10px] font-bold uppercase tracking-tight">RESPECT & MODERATION</p>
                    <p className="font-inter text-[9px] uppercase tracking-tighter text-white/40 leading-relaxed mt-1">No hate speech, toxicity, or harassment. Posts are reviewed periodically.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <RefreshCw size={16} className="shrink-0 text-[#F9FF00]" />
                  <div>
                    <p className="font-oswald text-[10px] font-bold uppercase tracking-tight">POSTING LIMITS</p>
                    <p className="font-inter text-[9px] uppercase tracking-tighter text-white/40 leading-relaxed mt-1">5 posts per day per IP/Device to prevent spam and flood.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Shield size={16} className="shrink-0 text-[#2563EB]" />
                  <div>
                    <p className="font-oswald text-[10px] font-bold uppercase tracking-tight">PRIVACY ASSURANCE</p>
                    <p className="font-inter text-[9px] uppercase tracking-tighter text-white/40 leading-relaxed mt-1">Names are public, but your identity remains anonymous if you choose 'Anonymous'.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Feed / Form Area */}
          <div className="lg:col-span-6 border-r-[4px] border-black flex flex-col bg-white">
            {/* Post Form */}
            <div className="p-8 border-b-[4px] border-black bg-[#fafafa]">
              <div className="flex gap-4 mb-4">
                <input 
                  type="text" 
                  className="input-brutal text-[10px] font-bold uppercase px-4 py-3 w-40 bg-white" 
                  placeholder="AUTHOR NAME"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
                <div className="flex-1 font-oswald text-[10px] font-bold uppercase flex items-center gap-2 text-black/30">
                  <span className="w-2 h-2 bg-[#059669] rounded-full animate-pulse" />
                  POSTING TO #{activeTab}
                </div>
              </div>
              <div className="flex gap-4">
                <textarea 
                  className="input-brutal flex-1 h-24 resize-none p-4 text-sm"
                  placeholder={activeTab === "CONTACT" ? "SEND A DIRECT MESSAGE..." : "SHARE YOUR THOUGHTS..."}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <button 
                  onClick={handlePost}
                  className="btn-brutal btn-brutal-yellow px-6 flex flex-col items-center justify-center gap-2"
                >
                  <Send size={20} />
                  <span className="font-oswald text-[10px] font-bold">POST</span>
                </button>
              </div>
            </div>

            {/* Feed */}
            <div className="flex-1 overflow-y-auto max-h-[500px] p-8 space-y-6 bg-white">
              {posts.filter(p => activeTab === "CONTACT" ? p.type === "CONTACT" : p.type !== "CONTACT").length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                  <MessageSquare size={48} className="mb-4" />
                  <p className="font-oswald text-xl font-bold uppercase">NO POSTS YET</p>
                </div>
              ) : (
                posts.filter(p => activeTab === "CONTACT" ? p.type === "CONTACT" : p.type !== "CONTACT").map((post) => (
                  <div key={post.id} className="border-[3px] border-black p-5 group hover:bg-[#F9FF00]/5 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="font-oswald text-xs font-bold uppercase text-[#FF0004]">@{post.author}</span>
                        <span className="mx-2 text-black/20">•</span>
                        <span className="font-inter text-[9px] text-black/40 uppercase font-bold">{new Date(post.timestamp).toLocaleDateString()}</span>
                      </div>
                      <span className="bg-black text-white text-[8px] font-bold px-2 py-0.5 tracking-widest">{post.type}</span>
                    </div>
                    <p className="font-inter text-sm leading-relaxed text-black/80">{post.content}</p>
                    <div className="mt-4 pt-4 border-t-[1px] border-black/5 flex items-center justify-between">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-2 font-oswald text-[10px] font-bold text-black/40 hover:text-[#FF0004] transition-colors"
                      >
                        <Heart size={14} className={post.likes > 0 ? "fill-[#FF0004] text-[#FF0004]" : ""} />
                        {post.likes} LIKES
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar - Contact Details */}
          <div className="lg:col-span-3 bg-white flex flex-col">
            <div className="p-8 bg-[#1a1a1a] text-white flex-1">
              <h3 className="font-oswald text-[10px] font-bold uppercase mb-8 tracking-widest text-[#F9FF00]">OPERATIONS</h3>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#FF0004] text-white font-oswald font-bold flex items-center justify-center border-[2px] border-white/20 shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-oswald text-[10px] font-bold uppercase tracking-widest">Support</h4>
                    <p className="font-inter text-[9px] text-white/40 uppercase mt-1">sah.rohit.dev@gmail.com</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white text-black font-oswald font-bold flex items-center justify-center border-[2px] border-black shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="font-oswald text-[10px] font-bold uppercase tracking-widest">THE CLEF MANIFESTO</h4>
                    <p className="font-inter text-[9px] text-white/40 uppercase mt-1 leading-relaxed">
                      "SIMPLICITY IS THE ULTIMATE SOPHISTICATION."<br />
                      BUILDING TOOLS THAT RESPECT YOUR TIME,<br />
                      YOUR DATA, AND YOUR WORKFLOW.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-20 space-y-8 pt-20 border-t-[1px] border-white/10">
                <h3 className="font-oswald text-[10px] font-bold uppercase tracking-widest text-white/40">DISTRIBUTION</h3>
                <div className="space-y-2">
                  <p className="font-oswald text-sm font-bold text-[#F9FF00]">FROM SONATA INTERACTIVE</p>
                  <p className="font-inter text-[10px] text-white/30 uppercase tracking-[0.2em] leading-relaxed">
                    A PERSONAL PROJECT BY ROHIT SAH. BUILT FOR THE CREATIVE COMMUNITY.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
