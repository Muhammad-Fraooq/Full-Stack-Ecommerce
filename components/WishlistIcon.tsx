'use client'
import userCartStore from "@/store";
import { HeartCrackIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const WishlistIcon = () => {
    const gropedWishlistItem = userCartStore((state)=>state.getWishlistCount())
  return (
    <Link
      href="/wishlist"
      className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-md shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none hoverEffect"
      aria-label="View your wishlist items"
    >
      <HeartCrackIcon className="text-2xl text-darkBlue" />
      <div className="flex flex-col">
        <span className="text-xs">
          <strong>{gropedWishlistItem && gropedWishlistItem?.length  || 0}</strong> items
        </span>
        <span className="font-semibold">Wishlist</span>
      </div>
    </Link>
  );
};

export default WishlistIcon;
