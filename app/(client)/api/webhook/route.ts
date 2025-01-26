import { Metadata } from "@/actions/createCheckoutSession";
import stripe from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendclient";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      {
        error: "No signature",
      },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.log("Stripe webhook secret is not set");
    return NextResponse.json(
      {
        error: "Stripe webhook secret is not set",
      },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      {
        error: `Webhook Error: ${error}`,
      },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      await createOrderInSanity(session);
      // const order = await createOrderInSanity(session);
      // console.log("Order created in Sanity:", order);
    } catch (error) {
      console.error("Error creating order in sanity:", error);
      return NextResponse.json(
        {
          error: `Error creating order: ${error}`,
        },
        { status: 400 }
      );
    }
  }
  return NextResponse.json({ received: true });
}

async function createOrderInSanity(session: Stripe.Checkout.Session) {
  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    // customer,
    total_details,
  } = session;

  const { orderNumber, customerName, customerEmail, clerkUserId } =
    metadata as unknown as Metadata;

  const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(
    id,
    { expand: ["data.price.product"] }
  );

  // Creating sanity product reference
  const sanityProducts = lineItemsWithProduct.data.map((item) => ({
    _key: crypto.randomUUID(),
    product: {
      _type: "reference",
      _ref: (item.price?.product as Stripe.Product)?.metadata?.id,
    },
    quantity: item?.quantity || 0,
  }));
  const order = await backendClient.create({
    _type: "order",
    orderNumber: orderNumber,
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
  return order;
}


// import { headers } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";
// import stripe from "@/lib/stripe";
// // @ts-ignore
// import { Metadata } from "@/actions/createCheckoutSession";
// import { backendClient } from "@/sanity/lib/backendclient";

// export const config = {
//   api: {
//     bodyParser: false, // Ensure raw body for Stripe signature verification
//   },
// };

// export async function POST(req: NextRequest) {
//   const body = await req.text(); // Raw body required for Stripe signature verification
//   const headersList = await headers();
//   const sig = headersList.get("stripe-signature") as string;

//   if (!sig) {
//     console.error("Missing Stripe signature");
//     return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
//   }

//   const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
//   if (!webhookSecret) {
//     console.error("Stripe webhook secret is not set");
//     return NextResponse.json(
//       { error: "Stripe webhook secret is not set" },
//       { status: 400 }
//     );
//   }

//   let event: Stripe.Event;
//   try {
//     event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
//   } catch (error) {
//     console.error("Webhook signature verification failed:", error);
//     return NextResponse.json(
//       { error: "Webhook signature verification failed" },
//       { status: 400 }
//     );
//   }

//   console.log("Stripe event received:", event);

//   // Handle the event
//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object as Stripe.Checkout.Session;

//     // Log the session for debugging
//     console.log("Stripe Checkout Session:", session);

//     try {
//       await processOrder(session);
//       return NextResponse.json({ received: true },{ status: 200 });
//     } catch (error) {
//       console.error("Error processing order:", error);
//       return NextResponse.json({ error: "Error processing order" }, { status: 500 });
//     }
//   }

//   return NextResponse.json({ received: true });
  
// }
// async function processOrder(session: Stripe.Checkout.Session) {
//   console.log("Starting processOrder with session:", session);

//   try {
//     const order = await createOrderInSanity(session);
//     console.log("Order successfully created in Sanity:", order);
//   } catch (error) {
//     console.error("Error in processOrder while creating order:", (error as Error).message);
//     console.error("Full error details:", error);
//     throw error;
//   }
// }

// async function createOrderInSanity(session: Stripe.Checkout.Session) {
//   console.log("Starting createOrderInSanity with session:", session);

//   const {
//     id,
//     amount_total,
//     currency,
//     metadata: stripeMetadata,
//     payment_intent,
//     total_details,
//   } = session;

//   // Validate metadata presence
//   if (!stripeMetadata) {
//     throw new Error("Metadata is missing in the Stripe session");
//   }

//   // Validate required fields in metadata
//   if (
//     !stripeMetadata.orderNumber ||
//     !stripeMetadata.customerName ||
//     !stripeMetadata.customerEmail ||
//     !stripeMetadata.clerkUserId
//   ) {
//     console.error("Metadata validation failed. Metadata:", stripeMetadata);
//     throw new Error(
//       `Missing metadata fields: ${
//         !stripeMetadata.orderNumber ? "orderNumber " : ""
//       }${!stripeMetadata.customerName ? "customerName " : ""}${
//         !stripeMetadata.customerEmail ? "customerEmail " : ""
//       }${!stripeMetadata.clerkUserId ? "clerkUserId " : ""}`.trim()
//     );
//   }

//   // Cast validated metadata to custom Metadata type
//   const metadata: Metadata = stripeMetadata as Metadata ;

//   console.log("Metadata validation passed:", metadata);
//   // Fetch line items
//   let lineItemsWithProduct;
//   try {
//     lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(id, {
//       expand: ["data.price.product"],
//     });
//     console.log("Line items fetched successfully:", lineItemsWithProduct.data);
//   } catch (error) {
//     console.error("Error fetching line items from Stripe:", (error as Error).message);
//     throw new Error("Failed to fetch line items from Stripe");
//   }

//   // Map products for Sanity
//   const sanityProducts = lineItemsWithProduct.data.map((item) => {
//     const productId = (item.price?.product as Stripe.Product)?.metadata?.id;

//     if (!productId) {
//       console.error("Missing product ID in line item metadata:", item);
//       throw new Error(`Missing product ID for line item: ${JSON.stringify(item)}`);
//     }

//     return {
//       _key: crypto.randomUUID(),
//       product: {
//         _type: "reference",
//         _ref: productId,
//       },
//       quantity: item.quantity || 0,
//       imageUrl: (item.price?.product as Stripe.Product)?.images?.[0] || "",
//     };
//   });

//   console.log("Sanity products mapped successfully:", sanityProducts);

//   // Create the order in Sanity
//   try {
//     const result = await backendClient.create({
//       _type: "order",
//       orderNumber: metadata.orderNumber,
//       stripeCheckoutSessionId: id,
//       stripePaymentIntentId: payment_intent,
//       customerName: metadata.customerName,
//       stripeCustomerId: metadata.customerEmail,
//       clerkUserId: metadata.clerkUserId,
//       email: metadata.customerEmail,
//       currency,
//       amountDiscount: total_details?.amount_discount
//         ? total_details.amount_discount / 100
//         : 0,
//         totalPrice: amount_total ? amount_total / 100 : 0,
//         products: sanityProducts,
//       status: "paid",
//       orderDate: new Date().toISOString(),
//     });

//     console.log("Order successfully created in Sanity:", result);
//     return result;
//   } catch (error) {
//     console.error("Sanity order creation failed:", (error as Error).message);
//     throw error;
//   }
// }

