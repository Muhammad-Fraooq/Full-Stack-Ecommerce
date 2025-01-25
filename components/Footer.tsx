import Image from "next/image";
import Link from "next/link";
import Payment from "@/public/images/payment.png";

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-gray-800">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-200">
        {/* Logo and About */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900">ShopifyX</h3>
          <p className="mt-4 text-sm text-gray-600">
            Your one-stop marketplace for all your shopping needs. Discover a
            wide variety of products at the best prices.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-gray-900">
                About Us
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-gray-900">
                Products
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-gray-900">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Service</h4>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="hover:text-gray-900">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-gray-900">
                Shipping & Delivery
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-gray-900">
                Returns & Refunds
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-gray-900">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Subscribe to Our Newsletter</h4>
          <p className="text-sm text-gray-600 mb-4">
            Get the latest updates, offers, and discounts directly in your inbox.
          </p>
          <form>
            <div className="flex items-center">
              <input
                type="email"
                placeholder="Your Email"
                className="px-4 py-2 w-full border border-gray-300 rounded-l-md focus:outline-none focus:ring focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-gray-100 py-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-around items-center">
        <div className="mt-4 md:mt-0 flex space-x-4">
            <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
              Cookie Policy
            </Link>
          </div>
          <div className="text-sm text-gray-600 text-center md:mt-1 md:text-left">
            © {new Date().getFullYear()} ShopifyX. All Rights Reserved.
          </div>
          <div className="mt-4 md:mt-0">
            <Image src={Payment} alt="Payment Methods" className="w-48 object-contain" />
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;





// import React from 'react'
// import Container from './Container'
// import Image from "next/legacy/image"
// import Payment from '@/public/images/payment.png'
// export default function Footer (){
//   return (
//     <footer className='bg-gray-200 text-sm'>
//         <Container className='py-5 flex items-center justify-between'>
//         <p className='text-gray-500'>Copyright &copy; {new Date().getFullYear()} <span className='text-darkBlue font-semibold'>Ecommerce Website</span> All rights reserved.</p>
//         <Image src={Payment} alt='logo' className='w-64 object-cover'/>
//         </Container>
//     </footer>
//   )
// }
