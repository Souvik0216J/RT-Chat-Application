import { internalMutation, internalQuery } from "./_generated/server"
import { v } from "convex/values"

export const create = internalMutation({
    args: {
        username: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        email: v.string()
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("users", args)
    }
})

export const upsert = internalMutation({
    args: {
        username: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        email: v.string()
    },
    handler: async (ctx, args) => {
        // Check if user already exists
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .unique();

        if (existingUser) {
            // Update existing user
            await ctx.db.patch(existingUser._id, {
                username: args.username,
                imageUrl: args.imageUrl,
                email: args.email
            });
        } else {
            // Create new user
            await ctx.db.insert("users", args);
        }
    }
})

export const get = internalQuery({
    args: { clerkId: v.string() },
    async handler(ctx, args) {
        return ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .unique();
    },
});