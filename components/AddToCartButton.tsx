'use client'
import { Product } from "@/sanity.types"
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import QuantityButton from "./QuantityButton";
import PriceFomatter from "./PriceFomatter";
import { useEffect, useState } from "react";
import userCartStore from "@/store";

interface Props {
    product: Product;
    className?: string;
}

const AddToCartButton = ({ product, className }: Props) => {
    const [isClient, setIsClient] = useState(false)
    const {addItem , getItemCount} = userCartStore();
    useEffect(() => {
      setIsClient(true)
    }, [])
    if(!isClient){
        return null
    }
    const itemCount = getItemCount(product?._id)
    const isOutOfStock = product?.stock === 0;
    const handlerAddToCart = () =>{
        addItem(product);
        toast.success(`${product?.name?.substring(1,12)}... Item added to cart!`);
    }

    return (
        <div>
            {itemCount ? (
                <div>
                    <div className="text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Quantity</span>
                            <QuantityButton product={product} />
                        </div>
                        <div className="flex items-center justify-center border-t pt-1">
                            <span>Subtotal</span>
                            <PriceFomatter amount={product?.price ? product?.price * itemCount : 0} />
                        </div>
                    </div>
                </div>
            ) : (
                <Button disabled={isOutOfStock} onClick={handlerAddToCart} className={cn(`bg-darkBlue/10 text-black border-darkBlue border py-2 mt-2 w-full hover:text-white hover:bg-darkBlue rounded-md font-medium hoverEffect
            disabled:hover:cursor-not-allowed disabled:bg-darkBlue/10 disabled:text-gray-400 disabled:hover:text-gray-400 disabled:border-darkBlue/10 `, className)}>Add To Cart</Button>
            )
            }
        </div>
    )
}
export default AddToCartButton;
