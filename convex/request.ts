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

        const request = await ctx.db.insert("requests", {
            senderEmail: currentUser.email,
            receiverEmail: receiver.email,
            sender: currentUser._id,
            receiver: receiver._id,
        })

        return request
    }
})