import type { Metadata } from "next";
import "../globals.css";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import { draftMode } from "next/headers";
import DisableDraftMode from "@/components/DisableDraftMode";
import { VisualEditing } from "next-sanity";
import { SanityLive } from "@/sanity/lib/live";
import Navber from "@/components/Navber";

const poppins = localFont({
  src: "../fonts/Poppins.woff2",
  variable: "--font-poppins",
  weight: "400",
  preload: true,
});

export const metadata: Metadata = {
  title: "ShopifyX | Your Ultimate Online Store for Deals & Discounts",
  description:
    "ShopifyX is the ultimate e-commerce platform offering exclusive discounts, trending products, and a seamless shopping experience. Perfect for all your shopping needs.",
  keywords: [
    "ecommerce website",
    "ShopifyX",
    "online store",
    "buy products online",
    "best discounts",
    "trending deals",
    "online shopping platform",
    "responsive e-commerce website",
    "educational e-commerce",
    "Shopify alternative",
    "secure shopping experience",
    "products on sale",
    "discount coupons",
    "shopping platform for students",
    "top online deals",
    "shopping with Stripe",
    "Shopify with Sanity",
  ],
  openGraph: {
    title: "ShopifyX | Your Ultimate Online Store for Deals & Discounts",
    description:
      "Discover trending products, exclusive deals, and the best discounts at ShopifyX, your trusted e-commerce platform. Shop now for a seamless experience!",
    url: "https://full-stack-ecommerce-website-seven.vercel.app/",
    type: "website",
    images: [
      {
        url: "https://full-stack-ecommerce-website-seven.vercel.app/meta-image.jpg", // Replace with your actual image URL
        width: 1200,
        height: 630,
        alt: "ShopifyX - Online Shopping Deals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopifyX | Your Ultimate Online Store for Deals & Discounts",
    description:
      "ShopifyX brings you trending products, unbeatable discounts, and a secure shopping experience. Explore your next favorite product today!",
    images: [
      "https://full-stack-ecommerce-website-seven.vercel.app/meta-image.jpg", // Replace with your actual image URL
    ],
  },
  authors: [{ name: "ShopifyX Team", url: "https://full-stack-ecommerce-website-seven.vercel.app/" }],
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://full-stack-ecommerce-website-seven.vercel.app/",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const draft = await draftMode();

  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <head>
          {/* Viewport */}
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
          {/* Theme Color */}
          <meta name="theme-color" content="#ffffff" />
        </head>
        <body className={`${poppins.variable} antialiased`}>
          {draft.isEnabled && (
            <>
              <DisableDraftMode />
              <VisualEditing />
            </>
          )}
          <Navber />
          {children}
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#000",
                color: "#fff",
                border: "1px solid #fffaee",
              },
            }}
          />
          {/* Only render SanityLive in server components */}
          <SanityLive />
        </body>
      </html>
    </ClerkProvider>
  );
}
