"use client";
import React from "react";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md"; // Import filled and outlined icons
import { FaRegEye } from "react-icons/fa";
import { TbArrowsRightLeft } from "react-icons/tb";
import { RiShoppingBag4Line } from "react-icons/ri";
import userCartStore from "@/store";
import { Product } from "@/sanity.types";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  className?: string;
}

const ProductCartBar = ({ product }: Props) => {
  const { toggleWishlist, isInWishlist } = userCartStore();

  const handleToggleWishlist = () => {
    toggleWishlist(product); // Add or remove the product from the wishlist
    const action = isInWishlist(product?._id) ? "added to" : "removed from";
    toast.success(
      `${product?.name?.substring(0, 12)}... ${action} your wishlist!`
    );
  };

  return (
    <div className="text-gray-500 text-lg flex items-center justify-center gap-2.5">
      {/* Wishlist Icon */}
      <div
        className="border shadow-md p-2 bg-white rounded-xl hover:bg-darkBlue hover:text-white hoverEffect cursor-pointer"
        onClick={handleToggleWishlist}
      >
        {isInWishlist(product?._id) ? (
          <MdFavorite className="text-red-500" /> // Filled heart for "in wishlist"
        ) : (
          <MdFavoriteBorder /> // Outlined heart for "not in wishlist"
        )}
      </div>

      {/* Other Icons */}
      <div className="border shadow-md p-2 bg-white rounded-xl hover:bg-darkBlue hover:text-white hoverEffect cursor-pointer">
        <FaRegEye />
      </div>
      <div className="border shadow-md p-2 bg-white rounded-xl hover:bg-darkBlue hover:text-white hoverEffect cursor-pointer">
        <TbArrowsRightLeft />
      </div>
      <div className="border shadow-md p-2 bg-white rounded-xl hover:bg-darkBlue hover:text-white hoverEffect cursor-pointer">
        <RiShoppingBag4Line />
      </div>
    </div>
  );
};

export default ProductCartBar;
