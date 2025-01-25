import { cn } from "@/lib/utils"

interface Props {
    amount: number | undefined
    className?: string
}

const PriceFomatter = ({ amount, className }: Props) => {
    const formettdPrice = new Number(amount).toLocaleString("en-US", {
        currency: "USD",
        style: "currency",
        minimumFractionDigits: 2

    })
    return <span className={cn(`text-sm font-semibold text-darkText`, className)}>{formettdPrice}</span>
}

export default PriceFomatter