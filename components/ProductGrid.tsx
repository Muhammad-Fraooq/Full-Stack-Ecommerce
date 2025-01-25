import { Product } from '@/sanity.types'
import React from 'react'
import ProductCard from './ProductCard'

const ProductGrid = ({products}:{products:Product[]}) => {
  return (
    <div>
         <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
        {products?.map((product) => <ProductCard key={product?._id} product={product} />
        )}
      </div>
    </div>
  )
}

export default ProductGrid