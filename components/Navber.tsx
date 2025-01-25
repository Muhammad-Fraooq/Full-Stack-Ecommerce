import Link from "next/link";
import React from "react";
import {
  ClerkLoaded,
  SignedIn,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import CartIcon from "./CartIcon";
import { BsBasket } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { getMyOrders } from "@/sanity/helpers";
import Container from "./Container";
import WishlistIcon from "./WishlistIcon";

const Navber = async () => {
  let user = null;
  let orders = null;

  try {
    user = await currentUser();
    const { userId } = await auth();
    if (userId) {
      orders = await getMyOrders(userId);
    }
  } catch (error) {
       console.error("Error fetching user or orders:", error);
  }

  return (
    <nav className="bg-white fixed top-0 left-0 z-50 w-full border-b border-gray-200 shadow-md py-1">
      <Container>
        <header className="flex items-center justify-between gap-4 py-2 flex-wrap">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
           <p className="text-darkBlue font-semibold text-3xl sm:text-2xl cursor-pointer">ShopifyX</p>
          </Link>

          {/* Search Bar */}
          <form
            action="/search"
            className="flex-1 w-full max-w-sm sm:mx-4 md:max-w-md lg:max-w-lg"
          >
            <input
              type="text"
              name="query"
              placeholder="Search for products"
              className="w-full px-4 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none hover:shadow-sm transition"
              aria-label="Search products"
            />
          </form>

          {/* User Actions */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Cart Icon */}
            <CartIcon />

            {/* Wishlist Icon */}
            <WishlistIcon />

            {/* User/Orders Section */}
            <ClerkLoaded>
              <SignedIn>
                <Link
                  href="/orders"
                  className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-md shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none hoverEffect "
                  aria-label="View your orders"
                >
                  <BsBasket className="text-lg sm:text-xl text-blue-600" />
                  <div className="flex flex-col">
                    <span className="text-xs">
                      <strong>{orders && orders?.length || 0}</strong> items
                    </span>
                    <span className="font-semibold">Orders</span>
                  </div>
                </Link>
              </SignedIn>

              {user ? (
                <div
                  className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-md shadow-sm hover:shadow-md hoverEffect "
                  aria-label="User menu"
                >
                  <UserButton />
                  <div className="text-xs sm:text-sm hidden sm:block">
                    {/* Name hidden on mobile, visible on larger screens */}
                    <p className="text-gray-400">Welcome Back</p>
                    <p className="font-bold">{user.fullName}</p>
                  </div>
                </div>
              ) : (
                <SignInButton mode="modal">
                  <div
                    className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-md shadow-sm cursor-pointer hover:shadow-md transition"
                    aria-label="Sign in to your account"
                  >
                    <FiUser className="text-lg sm:text-xl text-blue-600" />
                    <div className="flex flex-col">
                      <span className="text-xs">Account</span>
                      <span className="font-semibold">Login</span>
                    </div>
                  </div>
                </SignInButton>
              )}
            </ClerkLoaded>
          </div>
        </header>
      </Container>
    </nav>
  );
};

export default Navber;
