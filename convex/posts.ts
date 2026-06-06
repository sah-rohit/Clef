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
      dislikes: 0,
      replies: [],
    };
    return await ctx.db.insert("posts", newPost);
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

export const dislike = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (!post) throw new Error("Post not found");
    const currentDislikes = post.dislikes ?? 0;
    await ctx.db.patch(args.id, { dislikes: currentDislikes + 1 });
  },
});

export const edit = mutation({
  args: { id: v.id("posts"), content: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (!post) throw new Error("Post not found");
    await ctx.db.patch(args.id, { content: args.content });
  },
});

export const remove = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (!post) throw new Error("Post not found");
    await ctx.db.delete(args.id);
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
    
    const replyId = Math.random().toString(36).substring(2, 11);
    const newReply = {
      id: replyId,
      author: args.author,
      content: args.content,
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
    };
    
    await ctx.db.patch(args.postId, {
      replies: [...post.replies, newReply],
    });
    return replyId;
  },
});

export const likeReply = mutation({
  args: { postId: v.id("posts"), replyId: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    const updatedReplies = post.replies.map(r => {
      if (r.id === args.replyId) {
        return { ...r, likes: (r.likes ?? 0) + 1 };
      }
      return r;
    });
    await ctx.db.patch(args.postId, { replies: updatedReplies });
  },
});

export const dislikeReply = mutation({
  args: { postId: v.id("posts"), replyId: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    const updatedReplies = post.replies.map(r => {
      if (r.id === args.replyId) {
        return { ...r, dislikes: (r.dislikes ?? 0) + 1 };
      }
      return r;
    });
    await ctx.db.patch(args.postId, { replies: updatedReplies });
  },
});

export const editReply = mutation({
  args: { postId: v.id("posts"), replyId: v.string(), content: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    const updatedReplies = post.replies.map(r => {
      if (r.id === args.replyId) {
        return { ...r, content: args.content };
      }
      return r;
    });
    await ctx.db.patch(args.postId, { replies: updatedReplies });
  },
});

export const deleteReply = mutation({
  args: { postId: v.id("posts"), replyId: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    const updatedReplies = post.replies.filter(r => r.id !== args.replyId);
    await ctx.db.patch(args.postId, { replies: updatedReplies });
  },
});
