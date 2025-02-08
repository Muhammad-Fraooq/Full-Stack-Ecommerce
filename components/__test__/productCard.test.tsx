// ProductCard.test.js
import React from 'react';
import "@testing-library/jest-dom";
import { render, screen} from '@testing-library/react';
import ProductCard from '../ProductCard';
import { Product } from '@/sanity.types';

// Mock child components
jest.mock("../ProductCartBar", () => {
  return function MockProductCartBar() {
    return <div>ProductCartBar</div>;
  };
});

jest.mock("../PriceView", () => {
  return function MockPriceView() {
    return <div>PriceView</div>;
  };
});

jest.mock("../AddToCartButton", () => {
  return function MockAddToCartButton() {
    return <div>AddToCartButton</div>;
  };
});

describe('ProductCard', () => {
  const mockProduct: Product = {
    _id: '1',
    _type: 'product', // ✅ Ensure this is a literal "product"
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    _rev: '1',
    name: 'Test Product',
    price: 50,
    discount: 10,
    stock: 10,
    image: {
      _type:'image', 
      asset: { 
        _ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg",
        _type: "reference" as const, // Required by Sanity schema
      }
      
    },
    slug: { _type:'slug', current: 'test-product' },
    status: 'new',
    label: 'Sale',
  };
  
  it('renders the product card with correct details', () => {
    render(<ProductCard product={mockProduct} />);

    // Check if the product name is rendered
    expect(screen.getByText('Test Product')).toBeInTheDocument();

    // Check if the image is rendered with the correct source
    const image = screen.getByAltText('Product Image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image-ref');

    // Check if the status is rendered
    expect(screen.getByText('New')).toBeInTheDocument();

    // Check if the PriceView and AddToCartButton components are rendered
    expect(screen.getByText('PriceView')).toBeInTheDocument();
    expect(screen.getByText('AddToCartButton')).toBeInTheDocument();
  });

  it('displays out-of-stock overlay when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<ProductCard product={outOfStockProduct} />);

    // Check if the out-of-stock overlay is displayed
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('does not display out-of-stock overlay when stock is available', () => {
    render(<ProductCard product={mockProduct} />);

    // Check if the out-of-stock overlay is not displayed
    expect(screen.queryByText('Out of Stock')).not.toBeInTheDocument();
  });

  it('renders the ProductCartBar when stock is available', () => {
    render(<ProductCard product={mockProduct} />);

    // Check if the ProductCartBar is rendered
    expect(screen.getByText('ProductCartBar')).toBeInTheDocument();
  });

  it('does not render the ProductCartBar when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<ProductCard product={outOfStockProduct} />);

    // Check if the ProductCartBar is not rendered
    expect(screen.queryByText('ProductCartBar')).not.toBeInTheDocument();
  });

  it('renders the correct number of rating stars', () => {
    render(<ProductCard product={mockProduct} />);

    // Check if 5 stars are rendered
    const stars = screen.getAllByRole('img', { name: /star/i });
    expect(stars).toHaveLength(5);

    // Check if the last star is gray (unfilled)
    const lastStar = stars[4];
    expect(lastStar).toHaveClass('text-gray-500');
  });

  it('renders the correct category and rating section', () => {
    render(<ProductCard product={mockProduct} />);

    // Check if the category is rendered
    expect(screen.getByText('Snaks')).toBeInTheDocument();

    // Check if the rating stars are rendered
    expect(screen.getAllByRole('img', { name: /star/i })).toHaveLength(5);
  });
});