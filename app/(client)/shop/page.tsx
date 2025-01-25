import Container from '@/components/Container'
import ProductList from '@/components/ProductList'
import { getAllCategory, getAllProduct } from '@/sanity/helpers'
import React from 'react'


const ProductPage = async () => {
    const product = await getAllProduct()
    const category = await getAllCategory()
  return (
    <>
    <Container> 
     <ProductList products={product} title={true} categorise={category}/> 
     </Container>
    </>
  )
}

export default ProductPage