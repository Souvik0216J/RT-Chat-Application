import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";

interface WebhookEvent {
  type: string;
  data: any;
}

const validatePayload = async (req: Request): Promise<WebhookEvent | undefined> => {
  const payload = await req.text();

  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  try {
    const event = webhook.verify(payload, svixHeaders) as WebhookEvent;
    return event;
  } catch (error) {
    console.error("Clerk webhook request could not be verified");
    return;
  }
};

const handleClerkWebhook = httpAction(async (ctx, req) => {
  const event = await validatePayload(req);

  if (!event) {
    return new Response("Could not validate Clerk payload", { status: 400 });
  }

  switch (event.type) {
    // for both need same things
    case "user.created": 
    case "user.updated": {
      console.log(`Processing ${event.type} for user:`, event.data.id);

      try {
        // Use the username field from Clerk if available, otherwise fall back to name
        const username = event.data.username || 
                        `${event.data.first_name || ''} ${event.data.last_name || ''}`.trim() ||
                        event.data.email_addresses[0]?.email_address?.split('@')[0] ||
                        'User';

        await ctx.runMutation(internal.user.upsert, {
          username,
          imageUrl: event.data.image_url || "",
          clerkId: event.data.id,
          email: event.data.email_addresses[0]?.email_address || "",
        });

        console.log(`Successfully processed user: ${event.data.id}`);
      } catch (error) {
        console.error(`Error processing user ${event.data.id}:`, error);
        return new Response("Error processing user data", { status: 500 });
      }
      break;
    }

    default: {
      console.log("Clerk webhook event not supported:", event.type);
      break;
    }
  }

  return new Response(null, { status: 200 });
});

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

export default http;

