import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  }).index("email", ["email"]),
  
  posts: defineTable({
    type: v.string(),
    author: v.string(),
    content: v.string(),
    timestamp: v.string(),
    likes: v.number(),
    replies: v.array(v.object({
      id: v.string(),
      author: v.string(),
      content: v.string(),
      timestamp: v.string(),
    })),
  }),
});
