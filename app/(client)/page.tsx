import Container from '@/components/Container'
import DiscountBanner from '@/components/DiscountBanner'
import ProductList from '@/components/ProductList'
import { getAllCategory, getAllProduct, getSale } from '@/sanity/helpers'
import React from 'react'

const HomePage = async () => {
  const product = await getAllProduct()
  const sales = await getSale()
  const category = await getAllCategory()
  
  return (
   <div>
     <Container>
     <DiscountBanner sales={sales}/>
     <ProductList products={product} title={true} categorise={category}/>
     {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam, deleniti?</p> */}
    </Container>
   </div>
  )
}

export default HomePage
