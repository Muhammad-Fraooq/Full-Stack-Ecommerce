"use client";
import Container from "@/components/Container";
import PriceFormatter from "@/components/PriceFomatter";
import QuantityButtons from "@/components/QuantityButton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { urlFor } from "@/sanity/lib/image";
import useCartStore from "@/store";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import { ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EmptyCart from "@/components/EmptyCart";
import Loader from "@/components/Loader";
import {
  CreateCheckoutSession,
  Metadata,
} from "@/actions/createCheckoutSession";

const CartPage = () => {
  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
    resetCart,
  } = useCartStore();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const groupedItems = useCartStore((state) => state.getGroupsItems());
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return <Loader />;
  }

  const handleResetCart = () => {
    const confirmed = window.confirm("Are you sure to reset your Cart?");
    if (confirmed) {
      resetCart();
      toast.success("Your cart reset successfully!");
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const metadata: Metadata = {
        orderNumber: Math.floor(Math.random() * 100000).toString(),
        customerName: user?.fullName ?? "Unknown",
        customerEmail: user?.emailAddresses[0]?.emailAddress ?? "Unknown",
        clerkUserId: user!.id,
      };
      const checkoutUrl = await CreateCheckoutSession(groupedItems, metadata);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = (id: string) => {
    deleteCartProduct(id);
    toast.success("Product deleted successfully!");
  };
  return (
    <div className="bg-gray-50 pb-10">
      <Container>
        {groupedItems?.length ? (
          <>
            <div className="flex items-center gap-2 py-5">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-semibold">Shopping Cart</h1>
            </div>
            <div className="grid lg:grid-cols-3 md:gap-8">
              {/* Product View start */}
              <div className="lg:col-span-2 rounded-lg">
                <div className="grid grid-cols-5 md:grid-cols-6 border rounded-tr-lg rounded-tl-lg bg-white p-2.5 text-base font-semibold">
                  <h2 className="col-span-2 md:col-span-3">Product</h2>
                  <h2>Price</h2>
                  <h2>Quantity</h2>
                  <h2>Total</h2>
                </div>
                <div className="border bg-white border-t-0 rounded-br-lg rounded-bl-lg">
                  {groupedItems?.map(({ product }) => {
                    const itemCount = getItemCount(product?._id);
                    return (
                      <div
                        key={product?._id}
                        className="grid grid-cols-5 md:grid-cols-6 border-b p-2.5 last:border-b-0"
                      >
                        <div className="col-span-2 md:col-span-3 flex items-center">
                          <Trash2
                            onClick={() => handleDeleteProduct(product?._id)}
                            className="w-4 h-4 md:w-5 md:h-5 mr-1 text-gray-500 hover:text-red-600 hoverEffect"
                          />
                          {product?.image && (
                              <Link href={`/product/${product?.slug?.current}`}>
                            <div className="border p-0.5 md:p-1 mr-2 rounded-md overflow-hidden group">
                              <Image
                                src={urlFor(product.image).url()}
                                alt="productImage"
                                width={300}
                                height={300}
                                loading="lazy"
                                className="w-10 h-10 md:w-full md:h-14 object-cover group-hover:scale-105 overflow-hidden transition-transform duration-500"
                              />
                            </div>
                              </Link>
                          )}
                          <h2 className="text-sm">{product?.name}</h2>
                        </div>
                        <div className="flex items-center">
                          <PriceFormatter amount={product?.price} />
                        </div>
                        <QuantityButtons
                          product={product}
                          className="text-sm gap-0 md:gap-1"
                        />
                        <div className="flex items-center">
                          <PriceFormatter
                            amount={
                              product?.price ? product.price * itemCount : 0
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                  <Button
                    onClick={handleResetCart}
                    className="m-5 font-semibold"
                    variant="destructive"
                  >
                    Reset Cart
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-1 md:hidden lg:inline-block w-full bg-white p-6 rounded-lg border fixed bottom-0 left-0 lg:static lg:rounded-lg lg:p-6 lg:border">
                <h2 className="text-xl lg:text-lg font-semibold mb-4 lg:mb-2">
                  Order Summary
                </h2>
                <div className="space-y-4 lg:space-y-2">
                  <div className="flex justify-between">
                    <span>SubTotal</span>
                    <PriceFormatter amount={getSubTotalPrice()} />
                  </div>
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <PriceFormatter amount={getSubTotalPrice() - getTotalPrice()} />
                  </div>

                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <PriceFormatter
                      amount={useCartStore?.getState().getTotalPrice()}
                      className="text-lg font-bold text-black"
                    />
                  </div>
                  {isSignedIn ? (
                    <Button
                      onClick={handleCheckout}
                      disabled={loading}
                      className="w-full"
                      size="lg"
                    >
                      {loading ? "Processing" : "Proceed to Checkout"}
                    </Button>
                  ) : (
                    <SignInButton mode="modal">
                      <Button className="w-full" size="lg">
                        Sign in to Checkout
                      </Button>
                    </SignInButton>
                  )}
                  <Link
                    href="/"
                    className="block text-center text-sm text-primary hover:underline"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Product View end */}
            </div>
          </>
        ) : (
          <EmptyCart />
        )}
      </Container>
    </div>
  );
};

export default CartPage;
