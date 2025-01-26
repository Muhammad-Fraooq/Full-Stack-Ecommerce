'use client';
import Container from '@/components/Container';
import Loader from '@/components/Loader';
import ProductCard from '@/components/ProductCard';
import userCartStore from '@/store';
import React from 'react';
import { motion } from "framer-motion";

const WishlistPage = () => {
  const [isClient, setIsClient] = React.useState(false);
  const { wishlist} = userCartStore();

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loader />;
  }

  return (
    <Container>
      {wishlist.length > 0 ? (
        <div className="p-6">
          {/* Modern Wishlist Heading */}
          <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800 tracking-wide">
            Your Wishlist ❤️
          </h1>
          <p className="text-center text-gray-600 mb-10">
            Browse your saved items. Ready to add them to your cart? 🚀
          </p>

          {/* Wishlist Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {wishlist.map((product) => (
              <div key={product?._id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center justify-center py-20"
      >
        {/* Animated SVG Illustration */}
        <motion.svg
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "backOut" }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          fill="none"
          className="w-48 h-48 mx-auto"
        >
          {/* Heart Shape */}
          <motion.path
            d="M32 58s-22-14.35-22-28a11.88 11.88 0 0 1 12-12c5 0 8 4 10 6s5-6 10-6a11.88 11.88 0 0 1 12 12c0 13.65-22 28-22 28Z"
            fill="#FFD1D1"
            stroke="#FF6868"
            strokeWidth="2"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 1.2,
              delay: 0.3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
  
          {/* Small Circles as Decorations */}
          <circle cx="15" cy="15" r="2.5" fill="#FFD1D1" />
          <circle cx="49" cy="49" r="3.5" fill="#FFD1D1" />
          <circle cx="50" cy="16" r="2" fill="#FFD1D1" />
          <circle cx="20" cy="45" r="2" fill="#FFD1D1" />
        </motion.svg>
  
        {/* Animated Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-3xl font-bold text-gray-800 mb-4"
        >
          Your Wishlist is Empty
        </motion.h2>
  
        {/* Animated Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-gray-600 text-center max-w-md"
        >
          You haven&apos;t saved any products yet. Start exploring our collection
          and add items to your wishlist for quick access later!
        </motion.p>
  
        {/* Animated Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          onClick={() => (window.location.href = "/shop")}
          className="mt-6 px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition"
        >
          Explore Products
        </motion.button>
      </motion.div>
      )}
    </Container>
  );
};

export default WishlistPage;

