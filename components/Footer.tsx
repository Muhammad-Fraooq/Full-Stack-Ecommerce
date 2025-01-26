import Image from "next/image";
import Link from "next/link";
import Payment from "@/public/images/payment.png";

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-gray-800">
      {/* Top Section */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-gray-300">
        {/* Logo and About */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900">ShopifyX</h3>
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            Your one-stop marketplace for all your shopping needs. Discover a
            wide variety of products at the best prices.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {["Home", "About Us", "Products", "Contact Us"].map((item, index) => (
              <li key={index}>
                <Link
                  href={`/${item.toLowerCase().replace(" ", "-")}`}
                  className="text-sm hover:text-gray-900 transition"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Customer Service
          </h4>
          <ul className="space-y-2">
            {[
              "Help Center",
              "Shipping & Delivery",
              "Returns & Refunds",
              "Terms & Conditions",
            ].map((item, index) => (
              <li key={index}>
                <Link
                  href={`/${item.toLowerCase().replace(/ & | /g, "-")}`}
                  className="text-sm hover:text-gray-900 transition"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Subscribe to Our Newsletter
          </h4>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Get the latest updates, offers, and discounts directly in your
            inbox.
          </p>
          <form>
            <div className="flex items-center">
              <input
                type="email"
                placeholder="Your Email"
                className="px-4 py-2 w-full border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
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

      {/* Bottom Section */}
      <div className="bg-gray-100 py-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-around gap-6">
          {/* Links */}
          <div className="flex flex-wrap justify-center gap-4 text-gray-600 text-sm">
            <Link href="#" className="hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-gray-900">
              Cookie Policy
            </Link>
            <Link href="#" className="hover:text-gray-900">
              Terms of Service
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-600 text-center">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-darkBlue">ShopifyX</span>. All
            Rights Reserved.
          </div>

          {/* Payment Methods */}
          <div>
            <Image
              src={Payment}
              alt="Payment Methods"
              className="w-48 object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
