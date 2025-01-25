import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/legacy/image";
import Link from "next/link";
import ProductCartBar from "./ProductCartBar";
import { LucideStar } from "lucide-react";
import PriceView from './PriceView';
import AddToCartButton from "./AddToCartButton";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const isStock = product?.stock !== 0;
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden group text-sm">
      <div className="border-b border-b-gray-300 overflow-hidden relative">
        {product?.image && (
          <Link href={`/product/${product?.slug?.current}`}>
            <Image src={urlFor(product.image).url()}
              alt='productimage'
              width={400}
              height={400}
              loading="lazy"
              layout="intrinsic"
              className={`w-full max-h-72 object-cover overflow-hidden transition-transform ${product?.stock !== 0 && 'group-hover:scale-105'} duration-500`} />
          </Link>
        )}
        {product?.stock === 0 && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center ">
            <p className="text-lg font-bold text-white">Out of Stock</p>
          </div>
        )}
        {product?.status && product?.stock !== 0 && (
          <div className="absolute left-1 top-1 z-10 flex flex-col items-center space-y-1 group-hover:opacity-0 transition-opacity duration-300">
            {product?.status?.split('').map((char, index) => (
              <span key={index} className="font-semibold uppercase">{char}</span>
            ))}
          </div>
        )}
        {isStock && (
          <div className="absolute bottom-0 left-0 w-full translate-y-12 group-hover:-translate-y-4 hoverEffect">
            <ProductCartBar product={product}/>
          </div>
        )}
      </div>
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
        <p className="text-base text-gray-500 tracking-wide font-semibold line-clamp-1 capitalize">{product?.name}</p>
        <PriceView price={product?.price}
         discount={product?.discount}
          label={product?.label} 
          />
        <AddToCartButton product={product}/>
      </div>
    </div>
  )
}
export default ProductCard;