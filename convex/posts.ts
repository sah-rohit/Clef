import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { type: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // Collect all posts then sort by descending timestamp (simplest for small dataset)
    const posts = await ctx.db.query("posts").collect();
    const sorted = posts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    if (args.type) {
      return sorted.filter(p => p.type === args.type);
    }
    return sorted;
  },
});

export const create = mutation({
  args: {
    type: v.string(),
    author: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const newPost = {
      type: args.type,
      author: args.author,
      content: args.content,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
    };
    await ctx.db.insert("posts", newPost);
  },
});

export const like = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (!post) throw new Error("Post not found");
    await ctx.db.patch(args.id, { likes: post.likes + 1 });
  },
});

export const reply = mutation({
  args: {
    postId: v.id("posts"),
    author: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    
    const newReply = {
      id: Math.random().toString(36).substr(2, 9),
      author: args.author,
      content: args.content,
      timestamp: new Date().toISOString(),
    };
    
    await ctx.db.patch(args.postId, {
      replies: [...post.replies, newReply],
    });
  },
});
