import { mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values"
import { getUserByClerkId } from "./_utils";

export const create = mutation({
    args: {
        email: v.string()
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new ConvexError("Unauthorized access")
        }

        if (args.email === identity.email) {
            throw new ConvexError("Can't send a request to yourself")
        }

        const currentUser = await getUserByClerkId({
            ctx,
            clerkId: identity.subject,
        })

        if (!currentUser) {
            throw new ConvexError("User not found")
        }

        const receiver = await ctx.db.query("users").withIndex("by_email", (q) => q.eq("email", args.email)).unique()

        if (!receiver) {
            throw new ConvexError("User could not be found")
        }

        // Check if current user already sent a request to receiver
        const requestAlreadySent = await ctx.db.query("requests").withIndex("by_receiver_sender", q =>
            q.eq("receiver", receiver._id).eq("sender", currentUser._id)
        ).unique();

        if (requestAlreadySent) {
            console.log("Request already sent");
            throw new ConvexError("Request already sent")
        }

        // Check if receiver already sent a request to current user
        const requestAlreadyReceived = await ctx.db.query("requests").withIndex("by_receiver_sender", q =>
            q.eq("receiver", currentUser._id).eq("sender", receiver._id)
        ).unique();

        if (requestAlreadyReceived) {
            console.log("Request already received");
            throw new ConvexError("This user has already sent you a request")
        }

        const friends1 = await ctx.db.query("friends").withIndex("by_user1", (q) => q.eq("user1", currentUser._id)).collect()
        const friends2 = await ctx.db.query("friends").withIndex("by_user2", (q) => q.eq("user2", currentUser._id)).collect()

        if (friends1.some((friend) => friend.user2 === receiver._id) || friends2.some((friend) => friend.user1 === receiver._id)) {
            throw new ConvexError("You're already friends with this user")
        }

        const request = await ctx.db.insert("requests", {
            senderEmail: currentUser.email,
            receiverEmail: receiver.email,
            sender: currentUser._id,
            receiver: receiver._id,
        })

        return request
    }
})

export const deny = mutation({
    args: {
        id: v.id("requests")
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new ConvexError("Unauthorized access")
        }

        const currentUser = await getUserByClerkId({
            ctx,
            clerkId: identity.subject,
        })

        if (!currentUser) {
            throw new ConvexError("User not found")
        }

        const request = await ctx.db.get(args.id)

        if (!request || request.receiver !== currentUser._id) {
            throw new ConvexError("There was an error denying this request")
        }

        await ctx.db.delete(request._id)
    }
})

export const accept = mutation({
    args: {
        id: v.id("requests")
    }, handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new ConvexError("Unauthorized access")
        }

        const currentUser = await getUserByClerkId({
            ctx,
            clerkId: identity.subject,
        })

        if (!currentUser) {
            throw new ConvexError("User not found")
        }

        const request = await ctx.db.get(args.id)

        if (!request || request.receiver !== currentUser._id) {
            throw new ConvexError("There was an erro accepting this request")
        }

        const chatId = await ctx.db.insert("chats", {
            isGroup: false
        })

        await ctx.db.insert("friends", {
            user1: currentUser._id,
            user2: request.sender,
            chatId,
        })

        await ctx.db.insert("chatMembers", {
            memberId: currentUser._id,
            chatId
        })

        await ctx.db.insert("chatMembers", {
            memberId: request.sender,
            chatId
        })

        await ctx.db.delete(request._id)
    }
})