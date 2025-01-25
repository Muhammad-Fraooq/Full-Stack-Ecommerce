"use server";
import stripe from "@/lib/stripe";
import { urlFor } from "@/sanity/lib/image";
import { CartItem } from "@/store";
import Stripe from "stripe";

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
}

export interface GroupedCartItems {
  product: CartItem["product"];
  quantity: number;
}

export async function CreateCheckoutSession(
  items: GroupedCartItems[],
  metadata: Metadata
) {
  try {
    // Check for items without prices
    const itemsWithoutPrice = items.filter((item) => !item.product.price);
    if (itemsWithoutPrice.length > 0) {
      const itemNames = itemsWithoutPrice.map((item) => item.product.name).join(", ");
      throw new Error(`The following items do not have a price: ${itemNames}`);
    }

    // Check if base URL is defined
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      throw new Error("NEXT_PUBLIC_BASE_URL is not defined in the environment variables.");
    }

    // Retrieve customer details from Stripe
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    if (customers.data.length > 1) {
      console.warn(`Multiple customers found for email: ${metadata.customerEmail}`);
    }

    const customerId = customers.data.length > 0 ? customers.data[0].id : "";

    // Construct session payload
    const sessionPayload: Stripe.Checkout.SessionCreateParams = {
      metadata: {
        orderNumber: metadata.orderNumber,
        customerName: metadata.customerName,
        customerEmail: metadata.customerEmail,
        clerkUserId: metadata.clerkUserId,
      },
      mode: "payment",
      allow_promotion_codes: true,
      payment_method_types: ["card"],
      success_url: `https://full-stack-ecommerce-website-seven.vercel.app/success?orderNumber=${metadata.orderNumber.slice(-10) ?? "N/A"}`,
      cancel_url: `https://full-stack-ecommerce-website-seven.vercel.app/cart`,
      line_items: items.map((item) => ({
        price_data: {
          currency: "USD",
          unit_amount: Math.round(item.product.price! * 100),
          product_data: {
            name: item.product.name || "Unnamed Product",
            description: item.product.description,
            metadata: {
              id: item.product._id,
            },
            images: item.product.image
              ? [urlFor(item.product.image).url()]
              : undefined,
          },
        },
        quantity: item.quantity,
      })),
    };

    if (customerId) {
      sessionPayload.customer = customerId;
    } else {
      sessionPayload.customer_email = metadata.customerEmail;
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create(sessionPayload);
    return session.url;
  } catch (error) {
    console.error("Error creating checkout session:", {
      error: (error as Error).message,
      metadata,
      items,
    });
    throw error;
  }
}

