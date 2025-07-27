import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const get = query({
    args: {},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new Error("Unauthorized access")
        }

        const currentUser = await getUserByClerkId({
            ctx,
            clerkId: identity.subject,
        })

        if (!currentUser) {
            throw new ConvexError("User not found")
        }

        const requests = await ctx.db.query("requests").withIndex("by_receiver", q => q.eq("receiver", currentUser._id)).collect()

        const requestWithSender = await Promise.all(requests.map(async requests => {
            const sender = await ctx.db.get(requests.sender)

            if(!sender){
                throw new ConvexError("Request sender could not be found")
            }

            return {sender, requests}
        }))
        return requestWithSender
    }
})