import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
    users: defineTable({
        username: v.string(),
        imageUrl: v.optional(v.string()), // optional in case it's not provided
        clerkId: v.string(),
        email: v.string()
    }).index("by_email", ["email"]).index("by_clerkId", ["clerkId"])
})