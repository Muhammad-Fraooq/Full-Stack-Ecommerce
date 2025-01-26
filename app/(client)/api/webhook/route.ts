import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import stripe from "@/lib/stripe";
import { Metadata } from "@/actions/createCheckoutSession";
import { backendClient } from "@/sanity/lib/backendclient";

export const config = {
  api: {
    bodyParser: false, // Ensure raw body for Stripe signature verification
  },
};

export async function POST(req: NextRequest) {
  const body = await req.text(); // Raw body required for Stripe signature verification
  const headersList = await headers();
  const sig = headersList.get("stripe-signature") as string;

  if (!sig) {
    console.error("Missing Stripe signature");
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  if (!webhookSecret) {
    console.error("Stripe webhook secret is not set");
    return NextResponse.json(
      { error: "Stripe webhook secret is not set" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  console.log("Stripe event received:", event);

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Log the session for debugging
    console.log("Stripe Checkout Session:", session);

    try {
      await processOrder(session);
      return NextResponse.json({ received: true });
    } catch (error) {
      console.error("Error processing order:", error);
      return NextResponse.json({ error: "Error processing order" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
  
}

// Process the session asynchronously
async function processOrder(session: Stripe.Checkout.Session) {
  try {
    const order = await createOrderInSanity(session);
    console.log("Order successfully created in Sanity:", order);
  } catch (error) {
    console.error("Error creating order in Sanity:", error);
    throw error;
  }
}

// Create order in Sanity
async function createOrderInSanity(session: Stripe.Checkout.Session) {
  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    total_details,
  } = session;

  // Log metadata for debugging
  console.log("Session metadata:", metadata);

  const { orderNumber, customerName, customerEmail, clerkUserId } =
    metadata as unknown as Metadata;

  if (!orderNumber || !customerName || !customerEmail || !clerkUserId) {
    console.error("Missing required metadata fields:", metadata);
    throw new Error("Missing required metadata fields for creating order");
  }

  // Fetch line items with expanded product data
  let lineItemsWithProduct;
  try {
    lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(id, {
      expand: ["data.price.product"],
    });
    console.log("Line items with product data:", lineItemsWithProduct);
  } catch (error) {
    console.error("Error fetching line items:", error);
    throw error;
  }

  // Map products to Sanity format
  const sanityProducts = lineItemsWithProduct.data.map((item) => ({
    _key: crypto.randomUUID(),
    product: {
      _type: "reference",
      _ref: (item.price?.product as Stripe.Product)?.metadata?.id,
    },
    quantity: item?.quantity || 0,
    imageUrl: (item.price?.product as Stripe.Product)?.images?.[0], // Assuming first image URL
  }));

  const order = Math.floor(Math.random() * 100000).toString(); // Random order ID

  // Create the order in Sanity
  try {
    const result = await backendClient.create({
      _type: "order",
      orderNumber,
      stripeCheckoutSessionId: id,
      stripePaymentIntentId: payment_intent,
      customerName,
      stripeCustomerId: customerEmail,
      clerkUserId,
      email: customerEmail,
      currency,
      amountDiscount: total_details?.amount_discount
        ? total_details.amount_discount / 100
        : 0,
      products: sanityProducts,
      totalPrice: amount_total ? amount_total / 100 : 0,
      status: "paid",
      orderDate: new Date().toISOString(),
    });

    console.log("Sanity create result:", result);
    return result;
  } catch (createError) {
    console.error("Error creating order in Sanity:", createError);
    throw createError;
  }
}
