import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { FaInstagram, FaPinterest, FaYoutube } from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="w-full mt-20 text-white">
      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto bg-linear-to-b  from-transparent from-0% via-red-800 via-50% to-black px-6 py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* CONTACT */}
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl font-bold tracking-wide">ALBAX</h2>

          <p className="text-gray-300 text-sm leading-relaxed">
            Albax is India's fastest growing wholesale ecommerce platform
            offering premium quality products at unbeatable prices.
          </p>

          <p className="text-gray-300 text-sm">📍 Chennai, Tamil Nadu, India</p>

          <p className="text-gray-300 text-sm hover:text-white transition">
            support@albax.com
          </p>

          <p className="text-xl font-bold text-red-400">(+91) 73975 26519</p>

          <div className="flex items-center gap-3 mt-2">
            <MessageCircle className="text-red-400 w-8 h-8" />
            <p className="text-sm text-gray-300">
              Live Chat — Get instant help
            </p>
          </div>
        </div>

        {/* LINKS */}
        <div className="grid grid-cols-2 gap-10">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">Products</h3>

            <Link to="/products" className="footer-link">
              All Products
            </Link>

            <Link to="/products?q=new" className="footer-link">
              New Arrivals
            </Link>

            <Link to="/products" className="footer-link">
              Best Sellers
            </Link>

            <Link to="/cart" className="footer-link">
              My Cart
            </Link>

            <Link to="/wishlist" className="footer-link">
              Wishlist
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">Account</h3>

            <Link to="/orders" className="footer-link">
              Track Order
            </Link>

            <Link to="/profile" className="footer-link">
              My Account
            </Link>

            <Link to="/login" className="footer-link">
              Login
            </Link>

            <Link to="/register" className="footer-link">
              Register
            </Link>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div className="flex flex-col gap-5">
          <h3 className="text-lg font-semibold">Subscribe to Newsletter</h3>

          <p className="text-gray-300 text-sm">
            Get updates about new products and special offers.
          </p>

          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur-md outline-none focus:border-red-400 transition"
            />

            <button className="bg-red-500 hover:bg-red-600 transition py-3 rounded-lg font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t bg-black border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-5">
          {/* SOCIAL */}
          <div className="flex gap-5 text-xl text-gray-300">
            <FaInstagram className="hover:text-white cursor-pointer transition" />
            <FaSquareFacebook className="hover:text-white cursor-pointer transition" />
            <FaPinterest className="hover:text-white cursor-pointer transition" />
            <FaYoutube className="hover:text-white cursor-pointer transition" />
          </div>

          {/* COPYRIGHT */}
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Albax. All rights reserved.
          </p>

          {/* PAYMENTS */}
          <div className="flex gap-3 items-center">
            <img
              src="https://ecommerce-frontend-view.netlify.app/visa.png"
              className="h-6 opacity-80 hover:opacity-100 transition"
            />
            <img
              src="https://ecommerce-frontend-view.netlify.app/master_card.png"
              className="h-6 opacity-80 hover:opacity-100 transition"
            />
            <img
              src="https://ecommerce-frontend-view.netlify.app/paypal.png"
              className="h-6 opacity-80 hover:opacity-100 transition"
            />
            <img
              src="https://ecommerce-frontend-view.netlify.app/american_express.png"
              className="h-6 opacity-80 hover:opacity-100 transition"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
