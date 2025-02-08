import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/legacy/image";
import Link from "next/link";
import ProductCartBar from "./ProductCartBar";
import { LucideStar } from "lucide-react";
import PriceView from "./PriceView";
import AddToCartButton from "./AddToCartButton";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const isStock = product?.stock !== 0;

  return (
    <div className="border border-gray-300 rounded-xl shadow-lg overflow-hidden group text-sm bg-white transition-transform hover:scale-[1.02]">
      {/* Product Image Section */}
      <div className="border-b border-gray-200 relative overflow-hidden">
        {product?.image && (
          <Link href={`/product/${product?.slug?.current}`}>
            <Image
              src={product?.image ? urlFor(product?.image).url() : "https://via.placeholder.com/400"}
              alt={product?.name || "Product Image"}
              width={400}
              height={400}
              loading="lazy"
              layout="intrinsic"
              className={`w-full object-cover h-72 md:h-64 lg:h-56 transition-transform duration-500 ${isStock && "group-hover:scale-105"}`}
            />
          </Link>
        )}

        {/* Out of Stock Overlay */}
        {!isStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <p className="text-lg font-bold text-white">Out of Stock</p>
          </div>
        )}

        {/* Product Status */}
        {product?.status && isStock && (
          <div className="absolute left-2 top-2 bg-lightOrange text-white text-xs font-bold py-1 px-3 rounded-full shadow-sm">
            {product?.status}
          </div>
        )}

        {/* Product Cart Bar */}
        {isStock && (
          <div className="absolute bottom-0 left-0 w-full translate-y-12 group-hover:-translate-y-4 hoverEffect">
            <ProductCartBar product={product} />
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="flex flex-col gap-3">
        {/* Category and Ratings */}
        <div className="p-5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-gray-500 font-medium">Snaks</p>
          <div className="flex items-center w-28 text-gray-500  gap-1 ">
            {Array.from({ length: 5 }).map((_, index) => {
              const isLastStar = index === 4;
              return <LucideStar fill={!isLastStar ? "#fca99b" : "transparent"} key={index}
                className={`${isLastStar ? "text-gray-500" : "text-lightOrange"}`}
              />
            })}
          </div>
        </div>

        {/* Product Name */}
        <p className="text-base text-gray-800 tracking-wide font-semibold line-clamp-1 capitalize">
          {product?.name}
        </p>

        {/* Price View */}
        <PriceView
          price={product?.price}
          discount={product?.discount}
          label={product?.label}
        />

        {/* Add to Cart Button */}
        <AddToCartButton product={product} />
      </div>
    </div>
    </div>
  );
};

export default ProductCard;

