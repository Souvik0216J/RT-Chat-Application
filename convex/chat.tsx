import { ConvexError } from "convex/values"
import { query } from "./_generated/server"
import { getUserByClerkId } from "./_utils"

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

        const chatMemberships = await ctx.db.query("chatMembers").withIndex("by_memberId", q => q.eq("memberId", currentUser._id)).collect()

        const chats = await Promise.all(chatMemberships?.map(async membership => {
            const chat = await ctx.db.get(membership.chatId)
            if (!chat) {
                throw new ConvexError("Chat could not be found")
            }

            return chat
        }))

        const chatWithDetails = await Promise.all((await chats).map(async (chat, index) => {
            const allChatMemberships = await ctx.db.query("chatMembers").withIndex("by_chatId", (q) => q.eq("chatId", chat?._id)).collect()

            if (chat.isGroup) {
                return { chat }
            }
            else {
                const otherMembership = allChatMemberships.filter((membership) => membership.memberId !== currentUser._id)[0]
                const otherMember = await ctx.db.get(otherMembership.memberId)

                return {
                    chat, otherMember
                }
            }
        }))

        return chatWithDetails
    }
})
