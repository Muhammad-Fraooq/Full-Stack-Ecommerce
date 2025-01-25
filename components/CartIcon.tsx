'use client';
import userCartStore from '@/store';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const CartIcon = () => {
  const [isclient, setIsClient] = React.useState(false);
  const gropedItems = userCartStore((state)=>state.getGroupsItems());
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isclient) {
    return null
  }
  return (
    <Link
      href="/cart"
      className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-md shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none hoverEffect"
      aria-label="Go to cart"
    >
      <ShoppingBag className="h-5 w-5 md:h-6 md:w-6 text-darkBlue" />
      <div className="flex flex-col">
        <p className="text-xs">
          <span className="font-semibold">{gropedItems?.length ? gropedItems?.length : 0}</span> items
        </p>
        <p className="font-semibold">Cart</p>
      </div>
    </Link>
  );
};

export default CartIcon;
