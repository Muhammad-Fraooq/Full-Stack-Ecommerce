import { Category } from '@/sanity.types'
import React from 'react'
import CategorySelectors from './CategorySelectors'

const Categorise = ({categorise}:{categorise:Category[]}) => {
  return (
    <div className='py-5'>
      <CategorySelectors categorise={categorise}/>
    </div>
  )
}

export default Categorise