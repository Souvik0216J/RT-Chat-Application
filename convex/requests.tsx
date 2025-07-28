// import { ConvexError } from "convex/values";
// import { query } from "./_generated/server";
// import { getUserByClerkId } from "./_utils";

// export const get = query({
//     args: {},
//     handler: async (ctx, args) => {
//         const identity = await ctx.auth.getUserIdentity()

//         if (!identity) {
//             throw new Error("Unauthorized access")
//         }

//         const currentUser = await getUserByClerkId({
//             ctx,
//             clerkId: identity.subject,
//         })

//         if (!currentUser) {
//             throw new ConvexError("User not found")
//         }

//         const requests = await ctx.db.query("requests").withIndex("by_receiver", q => q.eq("receiver", currentUser._id)).collect()

//         const requestWithSender = await Promise.all(requests.map(async requests => {
//             const sender = await ctx.db.get(requests.sender)

//             if (!sender) {
//                 throw new ConvexError("Request sender could not be found")
//             }

//             return { sender, requests }
//         }))
//         return requestWithSender
//     }
// })

// export const count = query({
//     args: {},
//     handler: async (ctx, args) => {
//         const identity = await ctx.auth.getUserIdentity()

//         if (!identity) {
//             throw new Error("Unauthorized access")
//         }

//         const currentUser = await getUserByClerkId({
//             ctx,
//             clerkId: identity.subject,
//         })

//         if (!currentUser) {
//             throw new ConvexError("User not found")
//         }

//         const requests = await ctx.db.query("requests").withIndex("by_receiver", q => q.eq("receiver", currentUser._id)).collect()
//         return requests.length
//     }
// })

import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

// Helper function to get or create user
async function getOrCreateUser(ctx: any, identity: any) {
    let currentUser = await getUserByClerkId({
        ctx,
        clerkId: identity.subject,
    });

    // If user doesn't exist, create them
    if (!currentUser) {
        const userId = await ctx.db.insert("users", {
            clerkId: identity.subject,
            email: identity.email || "",
            name: identity.name || "",
            imageUrl: identity.pictureUrl || "",
        });
        
        currentUser = await ctx.db.get(userId);
    }

    return currentUser;
}

export const get = query({
    args: {},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized access");
        }

        const currentUser = await getOrCreateUser(ctx, identity);

        if (!currentUser) {
            throw new ConvexError("Unable to create or find user");
        }

        const requests = await ctx.db
            .query("requests")
            .withIndex("by_receiver", q => q.eq("receiver", currentUser._id))
            .collect();

        const requestWithSender = await Promise.all(requests.map(async request => {
            const sender = await ctx.db.get(request.sender);

            if (!sender) {
                throw new ConvexError("Request sender could not be found");
            }

            return { sender, requests: request }; // Keep original naming for backward compatibility
        }));

        return requestWithSender;
    }
});

export const count = query({
    args: {},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized access");
        }

        const currentUser = await getOrCreateUser(ctx, identity);

        if (!currentUser) {
            throw new ConvexError("Unable to create or find user");
        }

        const requests = await ctx.db
            .query("requests")
            .withIndex("by_receiver", q => q.eq("receiver", currentUser._id))
            .collect();

        return requests.length;
    }
});