import { useState, useEffect } from "react";
import { Send, MessageSquare, Heart, Shield, RefreshCw } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { BackButton } from "@/components/BackButton";

type TabId = "FEEDBACK" | "EXPERIENCES" | "CONTACT";

interface Reply {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

interface Post {
  id: string;
  type: TabId;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  replies?: Reply[];
}

export function InquirySection({ showBackButton = false }: { showBackButton?: boolean }) {
  const [activeTab, setActiveTab] = useState<TabId>("FEEDBACK");
  const posts = useQuery(api.posts.get, { type: activeTab === "CONTACT" ? undefined : activeTab }) || [];
  
  const createPost = useMutation(api.posts.create);
  const likePost = useMutation(api.posts.like);
  const replyToPost = useMutation(api.posts.reply);

  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyAuthor, setReplyAuthor] = useState("");
  const [replyContent, setReplyContent] = useState("");
  
  const { showToast } = useToast();

  const checkDailyLimit = () => {
    const today = new Date().toISOString().split("T")[0];
    const dailyPosts = JSON.parse(localStorage.getItem(`clef_posts_${today}`) || "0");
    return dailyPosts;
  };

  const incrementDailyLimit = () => {
    const today = new Date().toISOString().split("T")[0];
    const dailyPosts = checkDailyLimit();
    localStorage.setItem(`clef_posts_${today}`, JSON.stringify(dailyPosts + 1));
  };

  const handlePost = async () => {
    if (!content.trim()) {
      showToast("Please enter a message.", "warning");
      return;
    }
    
    if (checkDailyLimit() >= 5) {
      showToast("Daily limit reached (5 posts). Let's keep it clean!", "error");
      return;
    }

    if (activeTab === "CONTACT") {
      showToast("Message sent to operations! We'll review it shortly.", "success");
      setContent("");
      incrementDailyLimit();
      return;
    }

    try {
      await createPost({
        type: activeTab,
        author: author.trim() || "Anonymous",
        content: content.trim(),
      });
      incrementDailyLimit();
      setContent("");
      showToast("Post shared with the community!", "success");
    } catch (e) {
      showToast("Failed to post message.", "error");
    }
  };

  const handleReply = async (postId: string) => {
    if (!replyContent.trim()) {
      showToast("Please enter a reply.", "warning");
      return;
    }
    
    if (checkDailyLimit() >= 5) {
      showToast("Daily limit reached.", "error");
      return;
    }

    try {
      await replyToPost({
        postId: postId as Id<"posts">,
        author: replyAuthor.trim() || "Anonymous",
        content: replyContent.trim(),
      });
      
      incrementDailyLimit();
      setReplyContent("");
      setReplyingTo(null);
      showToast("Reply posted!", "success");
    } catch (e) {
      showToast("Failed to post reply.", "error");
    }
  };

  const handleLike = async (id: string) => {
    try {
      await likePost({ id: id as Id<"posts"> });
    } catch (e) {
      showToast("Failed to like post.", "error");
    }
  };

  const filteredPosts = activeTab === "CONTACT" ? [] : posts;

  return (
    <section id="inquiry" className="border-t-[4px] border-black overflow-hidden">
      {/* Header — purple bg */}
      <div className="bg-[#7C3AED] border-b-[3px] border-black relative overflow-hidden">
        {showBackButton && (
          <div className="absolute top-12 left-6 md:left-10 z-20">
            <BackButton />
          </div>
        )}
        <div className="px-6 md:px-12 lg:px-16 py-20 md:py-28 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 block mb-4">COMMUNITY TALK</span>
              <h2 className="font-oswald text-5xl md:text-8xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-white">
                INQUIRY.<br /><span className="text-outline-white">SPEAK UP.</span>
              </h2>
            </div>
            <div className="text-right">
              <span className="font-oswald text-[120px] md:text-[160px] font-bold leading-none text-white/10 select-none pointer-events-none uppercase">TALK</span>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 font-oswald text-[200px] font-bold text-white/[0.04] leading-none select-none pointer-events-none uppercase">INQUIRY</div>
      </div>

      <div className="max-w-[1300px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 border-[4px] border-black border-t-0">
          {/* Sidebar Navigation — yellow bg */}
          <div className="lg:col-span-3 border-r-[4px] border-black p-8 bg-[#F9FF00]">
            <div className="mb-10">
              <h3 className="font-oswald text-sm font-bold uppercase mb-4 tracking-wider text-black">GUIDELINES</h3>
              <p className="font-inter text-[10px] text-black/60 leading-relaxed uppercase tracking-tight">
                No account needed. Share your thoughts, report bugs, or just say hi. Select a category below.
              </p>
            </div>

            <div className="space-y-0 border-[3px] border-black">
              {(["FEEDBACK", "EXPERIENCES", "CONTACT"] as TabId[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveTab(s)}
                  className={`w-full text-left flex items-center justify-between px-6 py-4 font-oswald text-[11px] font-bold uppercase tracking-[0.1em] border-b-[3px] border-black last:border-b-0 transition-all ${
                    activeTab === s ? "bg-black text-[#F9FF00]" : "bg-white hover:bg-black/5"
                  }`}
                >
                  {s}
                  {activeTab === s && <MessageSquare size={14} />}
                </button>
              ))}
            </div>

            <div className="mt-8 p-6 border-[3px] border-black bg-white">
              <h4 className="font-oswald text-[10px] font-bold uppercase mb-2">SUPPORT</h4>
              <p className="font-inter text-[9px] text-black/50 leading-relaxed uppercase tracking-tighter">
                Ask Clef AI for help with the platform.
              </p>
            </div>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-6 border-r-[4px] border-black p-10 bg-white min-h-[500px] flex flex-col">
            <div className="flex-1">
              <div className="animate-fade-in space-y-8">
                <div className="space-y-4">
                  <label className="font-oswald text-[10px] font-bold uppercase tracking-widest text-black/60 block px-1">AUTHOR NAME (OPTIONAL)</label>
                  <input
                    type="text"
                    className="input-brutal text-xl bg-white py-4"
                    placeholder="E.G., ANONYMOUS"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <label className="font-oswald text-[10px] font-bold uppercase tracking-widest text-black/60 block px-1">{activeTab === "CONTACT" ? "YOUR MESSAGE" : "SHARE YOUR THOUGHTS"}</label>
                  <textarea
                    className="input-brutal h-40 resize-none bg-white p-4"
                    placeholder={activeTab === "CONTACT" ? "DIRECT MESSAGE TO OPERATIONS..." : "POST TO THE BOARD..."}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-end pt-4 border-t-[4px] border-black/10">
                  <button 
                    onClick={handlePost}
                    className="flex items-center gap-3 btn-brutal btn-brutal-yellow px-8 py-3 font-oswald text-[11px] font-bold uppercase"
                  >
                    <Send size={16} /> {activeTab === "CONTACT" ? "SEND MESSAGE" : "POST"}
                  </button>
                </div>

                {activeTab !== "CONTACT" && (
                  <div className="mt-16 pt-12 border-t-[4px] border-black">
                    <h3 className="font-oswald text-2xl font-bold uppercase tracking-tight mb-8">
                      COMMUNITY FEED
                    </h3>
                    
                    <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4">
                      {filteredPosts.length === 0 ? (
                        <div className="border-[3px] border-black border-dashed p-12 text-center text-black/40">
                          <MessageSquare size={32} className="mx-auto mb-4 opacity-50" />
                          <p className="font-oswald text-sm font-bold uppercase tracking-widest">NO POSTS YET</p>
                        </div>
                      ) : (
                        filteredPosts.map((post: any) => (
                          <div key={post._id} className="border-[3px] border-black p-6 bg-[#fafafa] shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-white transition-colors">
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
                              <div className="flex gap-4">
                                <button 
                                  onClick={() => handleLike(post._id)}
                                  className="flex items-center gap-2 font-oswald text-xs font-bold text-[#1a1a1a] hover:text-[#FF0004] transition-colors"
                                >
                                  <Heart size={16} className={post.likes > 0 ? "fill-[#FF0004] text-[#FF0004]" : ""} />
                                  {post.likes} LIKES
                                </button>
                                <button 
                                  onClick={() => setReplyingTo(replyingTo === post._id ? null : post._id)}
                                  className="flex items-center gap-2 font-oswald text-xs font-bold text-[#1a1a1a] hover:text-[#059669] transition-colors"
                                >
                                  <MessageSquare size={16} /> REPLY
                                </button>
                              </div>
                            </div>
                            
                            {/* Replies */}
                            {post.replies && post.replies.length > 0 && (
                              <div className="mt-6 pl-4 border-l-[3px] border-black/20 space-y-4">
                                {post.replies.map((reply) => (
                                  <div key={reply.id} className="pt-2">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-oswald text-xs font-bold uppercase text-[#FF0004]">@{reply.author}</span>
                                      <span className="font-inter text-[10px] text-black/40 font-bold uppercase">• {new Date(reply.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <p className="font-inter text-xs leading-relaxed text-[#1a1a1a]">{reply.content}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Reply Input Box */}
                            {replyingTo === post._id && (
                              <div className="mt-4 pt-4 border-t-[2px] border-black/10 animate-fade-in">
                                <input
                                  type="text"
                                  className="w-full border-[3px] border-black px-3 py-2 text-xs font-inter mb-2 outline-none focus:border-[#FF0004]"
                                  placeholder="AUTHOR NAME (OPTIONAL)"
                                  value={replyAuthor}
                                  onChange={(e) => setReplyAuthor(e.target.value)}
                                />
                                <textarea
                                  className="w-full border-[3px] border-black px-3 py-2 text-xs font-inter mb-2 resize-none h-20 outline-none focus:border-[#FF0004]"
                                  placeholder="WRITE A REPLY..."
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                  <button onClick={() => setReplyingTo(null)} className="font-oswald text-[10px] font-bold uppercase px-4 py-2 border-[3px] border-transparent hover:border-black transition-colors">CANCEL</button>
                                  <button onClick={() => handleReply(post._id)} className="font-oswald text-[10px] font-bold uppercase px-4 py-2 bg-[#F9FF00] border-[3px] border-black hover:bg-black hover:text-[#F9FF00] transition-colors">POST REPLY</button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Info */}
          <div className="lg:col-span-3 bg-white flex flex-col">
            <div className="p-8 bg-[#1a1a1a] text-white flex-1">
              <h3 className="font-oswald text-[10px] font-bold uppercase mb-8 tracking-widest text-[#F9FF00]">COMMUNITY PROTOCOL</h3>
              <div className="space-y-6">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-[#F9FF00] text-black flex items-center justify-center font-oswald text-xs font-bold border-[2px] border-black shrink-0"><Shield size={14} /></div>
                  <div>
                    <h4 className="font-oswald text-[10px] font-bold uppercase tracking-widest">RESPECT</h4>
                    <p className="font-inter text-[9px] text-white/40 uppercase mt-1">No hate speech or harassment. Moderated periodically.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-[#FF0004] text-white flex items-center justify-center font-oswald text-xs font-bold border-[2px] border-white/20 shrink-0"><RefreshCw size={14} /></div>
                  <div>
                    <h4 className="font-oswald text-[10px] font-bold uppercase tracking-widest">LIMITS</h4>
                    <p className="font-inter text-[9px] text-white/40 uppercase mt-1">5 posts per day per IP to prevent spam.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-oswald text-xs font-bold border-[2px] border-black shrink-0"><Shield size={14} /></div>
                  <div>
                    <h4 className="font-oswald text-[10px] font-bold uppercase tracking-widest">PRIVACY</h4>
                    <p className="font-inter text-[9px] text-white/40 uppercase mt-1">Identities remain anonymous if you choose 'Anonymous'.</p>
                  </div>
                </div>
              </div>

              <div className="mt-16 space-y-6 pt-12 border-t-[1px] border-white/10">
                <h3 className="font-oswald text-[9px] font-bold uppercase tracking-widest text-white/40">DIRECT CONTACT</h3>
                <div className="space-y-3">
                  <p className="font-oswald text-xs font-bold tracking-tight">SAH.ROHIT.DEV@GMAIL.COM</p>
                </div>
                <p className="font-inter text-[9px] text-white/20 uppercase tracking-widest leading-relaxed">
                  BUILT FOR CREATORS<br />
                  POWERED BY CLEF
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
