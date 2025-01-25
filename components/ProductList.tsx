import { Category, Product } from '@/sanity.types'
import React from 'react'
import Categorise from './Categorise'
import ProductGrid from './ProductGrid'

interface Props {
  products: Product[]
  title?: boolean
  categorise: Category[]
}

const ProductList = ({ products, title, categorise }: Props) => {
  return (
    <div className='pb-32'>
      <Categorise categorise={categorise} />
      {/* Products */}
     {title && (
       <div className='pb-5'>
       <h2 className='text-2xl font-semibold text-gray-600'>Day of the <span className='text-lightBlue'>Deal</span></h2>
       <p className='text-sm text-gray-500'>Don&apos;t wait! The time will naver be just right.</p>
     </div>
     )}
     <ProductGrid products={products}/>
    </div>
  )
}

export default ProductList