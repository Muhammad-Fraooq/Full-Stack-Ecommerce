import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import stripe from "@/lib/stripe";
import { Metadata } from "@/actions/createCheckoutSession";
import { backendClient } from "@/sanity/lib/backendclient";

export async function POST(req: NextRequest) {
  const body = await req.text(); // Ensure raw body is read

  const headersList = await headers();
  const sig = headersList.get("stripe-signature") as string;

  if (!sig) {
    console.error("Missing Stripe signature");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
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
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  console.log("Stripe event received:", event);

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    processOrder(session);
  }

  return NextResponse.json({ received: true });
}

// Process the session asynchronously
async function processOrder(session: Stripe.Checkout.Session) {
  try {
    const order = await createOrderInSanity(session);
    console.log("Order created in Sanity:", order);
  } catch (error) {
    console.error("Error creating order in Sanity:", error);
  }
}
async function createOrderInSanity(session: Stripe.Checkout.Session) {
  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    total_details,
  } = session;

  const { orderNumber, customerName, customerEmail, clerkUserId } =
    metadata as unknown as Metadata;

  if (!orderNumber || !customerName || !customerEmail || !clerkUserId) {
    throw new Error("Missing required metadata fields for creating order");
  }

  const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(
    id,
    { expand: ["data.price.product"] }
  );

  const sanityProducts = lineItemsWithProduct.data.map((item) => ({
    _key: crypto.randomUUID(),
    product: {
      _type: "reference",
      _ref: (item.price?.product as Stripe.Product)?.metadata?.id,
    },
    quantity: item?.quantity || 0,
    imageUrl: (item.price?.product as Stripe.Product)?.images?.[0], // Assuming first image URL
  }));

  const order = Math.floor(Math.random() * 100000).toString(); // Using the generated order ID

  try {
    await backendClient.create({
      _type: "order",
      orderNumber,
      stripeCheckoutSessionId: id,
      stripePaymentIntentId: payment_intent,
      customerName,
      stripeCustomerId: customerEmail,
      clerkUserId: clerkUserId,
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
  } catch (createError) {
    console.error("Error creating order in Sanity:", createError);
    throw createError;
  }

  return order;
}
