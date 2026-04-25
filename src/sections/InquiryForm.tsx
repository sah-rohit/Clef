import { useState, useEffect } from "react";
import { MessageSquare, Send, Heart, Shield, RefreshCw } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

type TabId = "FEEDBACK" | "EXPERIENCES" | "CONTACT";

interface Post {
  id: string;
  type: TabId;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
}

export function InquiryForm() {
  const [activeTab, setActiveTab] = useState<TabId>("FEEDBACK");
  const [posts, setPosts] = useState<Post[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("clef_community_posts");
    if (saved) {
      setPosts(JSON.parse(saved));
    } else {
      const initial: Post[] = [
        { id: "1", type: "EXPERIENCES", author: "DevPro", content: "The JSON formatter is insanely fast. Best I've used.", timestamp: new Date().toISOString(), likes: 12 },
        { id: "2", type: "FEEDBACK", author: "CreativeAria", content: "Would love to see a SVG optimizer tool added next!", timestamp: new Date().toISOString(), likes: 8 },
      ];
      setPosts(initial);
      localStorage.setItem("clef_community_posts", JSON.stringify(initial));
    }
  }, []);

  const handlePost = () => {
    if (!content.trim()) return;
    
    const today = new Date().toISOString().split("T")[0];
    const dailyPosts = JSON.parse(localStorage.getItem(`clef_posts_${today}`) || "0");
    if (dailyPosts >= 5) {
      showToast("Daily limit reached (5 posts). Let's keep it clean!", "error");
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

    if (activeTab === "CONTACT") {
      showToast("Message sent to operations! We'll review it shortly.", "success");
      setContent("");
      localStorage.setItem(`clef_posts_${today}`, JSON.stringify(dailyPosts + 1));
      return;
    }

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

  const tabs: { label: string; id: TabId }[] = [
    { label: "FEEDBACK", id: "FEEDBACK" },
    { label: "EXPERIENCES", id: "EXPERIENCES" },
    { label: "CONTACT US", id: "CONTACT" },
  ];

  const filteredPosts = posts.filter(p => activeTab === "CONTACT" ? p.type === "CONTACT" : p.type === activeTab);

  return (
    <section id="inquiry" className="border-b-[3px] border-black scroll-mt-20">
      {/* Section Header */}
      <div className="border-b-[3px] border-black px-6 md:px-12 lg:px-16 py-12">
        <span className="font-oswald text-xs font-bold uppercase tracking-[0.2em] text-[#FF0004] block mb-2">
          Community Talk
        </span>
        <h2 className="font-oswald text-4xl md:text-6xl font-bold uppercase tracking-[-0.03em]">
          INQUIRY
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column - Instructions */}
        <div className="lg:col-span-3 border-r-[3px] border-black border-b-[3px] lg:border-b-0 px-6 md:px-8 py-8 bg-[#fafafa]">
          <h3 className="font-oswald text-lg font-bold uppercase tracking-tight mb-4">
            CATEGORIES
          </h3>
          <p className="font-inter text-xs leading-relaxed text-[#1a1a1a]/70 mb-6">
            No account needed. Share your thoughts, report bugs, or just say hi. Select a category below to get started.
          </p>

          {/* Tab indicator */}
          <div className="space-y-0">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-full text-left px-4 py-3 border-[3px] border-black mb-[-3px] relative transition-colors ${
                  activeTab === t.id
                    ? "bg-[#F9FF00] z-10"
                    : "bg-white hover:bg-[#F9FF00]/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-oswald text-sm font-bold uppercase tracking-wider">
                    {t.label}
                  </span>
                  {activeTab === t.id && <MessageSquare size={14} />}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 border-[3px] border-black p-4 bg-white">
            <h4 className="font-oswald text-xs font-bold uppercase tracking-widest mb-2">
              NEED IMMEDIATE HELP?
            </h4>
            <p className="font-inter text-[11px] leading-relaxed text-[#1a1a1a]/60">
              Use the AI widget in the bottom right corner to get instant automated assistance for any queries.
            </p>
          </div>
        </div>

        {/* Middle Column - Form & Feed */}
        <div className="lg:col-span-6 border-r-[3px] border-black px-6 md:px-10 py-8">
          <div className="space-y-6">
            <div>
              <label className="font-oswald text-xs font-bold uppercase tracking-widest block mb-2">
                Display Name (Optional)
              </label>
              <input
                type="text"
                className="input-brutal relative bg-white"
                placeholder="e.g., Anonymous"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>

            <div>
              <label className="font-oswald text-xs font-bold uppercase tracking-widest block mb-2">
                {activeTab === "CONTACT" ? "Your Message" : "Share your thoughts"}
              </label>
              <textarea
                className="input-brutal min-h-[120px] resize-none bg-white"
                placeholder={activeTab === "CONTACT" ? "Send a direct message to our operations team..." : "Write your post here..."}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                onClick={handlePost}
                className="btn-brutal btn-brutal-yellow flex items-center gap-2"
              >
                <Send size={16} />
                {activeTab === "CONTACT" ? "SEND MESSAGE" : "POST TO BOARD"}
              </button>
            </div>
          </div>

          {activeTab !== "CONTACT" && (
            <div className="mt-12 pt-12 border-t-[3px] border-black">
              <h3 className="font-oswald text-2xl font-bold uppercase tracking-tight mb-8">
                COMMUNITY FEED
              </h3>
              
              <div className="space-y-6">
                {filteredPosts.length === 0 ? (
                  <div className="border-[3px] border-black border-dashed p-12 text-center text-black/40">
                    <MessageSquare size={32} className="mx-auto mb-4 opacity-50" />
                    <p className="font-oswald text-sm font-bold uppercase tracking-widest">No posts in this category yet</p>
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <div key={post.id} className="border-[3px] border-black p-6 bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                      <div className="flex justify-between items-start mb-4 pb-4 border-b-[2px] border-black/10">
                        <div>
                          <span className="font-oswald text-sm font-bold uppercase text-[#FF0004]">@{post.author}</span>
                          <span className="mx-2 text-black/20">•</span>
                          <span className="font-inter text-xs text-black/40 font-bold uppercase">{new Date(post.timestamp).toLocaleDateString()}</span>
                        </div>
                        <span className="bg-black text-[#F9FF00] text-[10px] font-bold px-3 py-1 tracking-widest uppercase">{post.type}</span>
                      </div>
                      <p className="font-inter text-sm leading-relaxed text-[#1a1a1a]">{post.content}</p>
                      <div className="mt-6 pt-4 border-t-[2px] border-black flex items-center justify-between">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-2 font-oswald text-xs font-bold text-[#1a1a1a] hover:text-[#FF0004] transition-colors"
                        >
                          <Heart size={16} className={post.likes > 0 ? "fill-[#FF0004] text-[#FF0004]" : ""} />
                          {post.likes} LIKES
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Rules / Info */}
        <div className="lg:col-span-3 px-6 md:px-8 py-8 bg-[#1a1a1a] text-white">
          <div className="mb-8">
            <h4 className="font-oswald text-xs font-bold uppercase tracking-[0.2em] text-[#F9FF00] mb-3">
              COMMUNITY PROTOCOL
            </h4>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#F9FF00] text-black flex items-center justify-center font-oswald text-xs font-bold flex-shrink-0">
                  <Shield size={16} />
                </div>
                <div>
                  <p className="font-inter text-xs font-medium uppercase tracking-wider text-white">
                    RESPECT & MODERATION
                  </p>
                  <p className="font-inter text-[10px] text-white/50 mt-1">
                    No hate speech, toxicity, or harassment. Posts are reviewed periodically.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#FF0004] text-white flex items-center justify-center font-oswald text-xs font-bold flex-shrink-0">
                  <RefreshCw size={16} />
                </div>
                <div>
                  <p className="font-inter text-xs font-medium uppercase tracking-wider text-white">
                    POSTING LIMITS
                  </p>
                  <p className="font-inter text-[10px] text-white/50 mt-1">
                    5 posts per day per IP/Device to prevent spam and flood.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-oswald text-xs font-bold flex-shrink-0">
                  <Shield size={16} />
                </div>
                <div>
                  <p className="font-inter text-xs font-medium uppercase tracking-wider text-white">
                    PRIVACY ASSURANCE
                  </p>
                  <p className="font-inter text-[10px] text-white/50 mt-1">
                    Names are public, but your identity remains anonymous if you choose 'Anonymous'.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6">
            <h4 className="font-oswald text-xs font-bold uppercase tracking-[0.2em] text-[#F9FF00] mb-3">
              Direct Contact
            </h4>
            <p className="font-inter text-xs text-white/70 leading-relaxed">
              support@clef.suite
              <br />
              +1 (212) 555-0147
              <br />
              <br />
              48 W 25th St, Floor 9
              <br />
              New York, NY 10010
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
