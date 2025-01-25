import { cn } from '@/lib/utils'

interface Props{
    className?:string
    children:React.ReactNode
}

const Container = ({className ,children }:Props) => {
  return (
    <div className={cn('max-w-screen-xl mx-auto px-4',className)}>
        {children}
    </div>
  )
}

export default Container