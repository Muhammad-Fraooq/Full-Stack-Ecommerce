import type { Metadata } from "next";
import "../globals.css";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import { draftMode } from "next/headers";
import DisableDraftMode from "@/components/DisableDraftMode";
import { VisualEditing } from "next-sanity";
import { SanityLive } from "@/sanity/lib/live";  // Ensure this is server-side only
import Navber from "@/components/Navber";

const poppins = localFont({
  src: "../fonts/Poppins.woff2",
  variable: "--font-poppins",
  weight: "400",
  preload: true,
});

export const metadata: Metadata = {
  title: "Ecommerce Website for Shoppers",
  description: "Ecommerce Website for educational purpose",
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
        <body className={`${poppins.variable} antialiased`}>
          {draft.isEnabled && (
            <>
              <DisableDraftMode />
              <VisualEditing />
            </>
          )}
          <Navber/>
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
