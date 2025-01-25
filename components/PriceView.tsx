import { cn } from "@/lib/utils"
import PriceFomatter from "./PriceFomatter"

interface Props {
  price: number | undefined,
  discount: number | undefined,
  className?: string,
  label?: string
}

const PriceView = ({ price, discount, className, label }: Props) => {
  return (
    <div className="flex justify-between items-center gap-5 ">
      <div className="flex items-center gap-2">
        <PriceFomatter amount={price} className={className} />
        {price && discount && <PriceFomatter amount={price + (discount * price) / 100} className={cn(`text-xs font-medium line-through`,className)} />}
      </div>
      <p className="text-gray-500">{label}</p>
    </div>
  )
}

export default PriceView