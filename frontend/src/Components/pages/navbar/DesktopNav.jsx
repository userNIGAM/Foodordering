import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";

const DesktopNav = ({
  location,
  onCartClick,
  cartItemsCount,
  wishlistCount,
}) => {
  return (
    <div className="hidden md:flex items-center space-x-6">
      {/* Home */}
      <Link
        to="/"
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          location.pathname === "/"
            ? "text-indigo-600 bg-indigo-50"
            : "text-slate-700 hover:text-indigo-600"
        }`}
      >
        Home
      </Link>

      {/* Menu */}
      <Link
        to="/menu"
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          location.pathname === "/menu"
            ? "text-indigo-600 bg-indigo-50"
            : "text-slate-700 hover:text-indigo-600"
        }`}
      >
        Menu
      </Link>

      {/* About Us */}
      <Link
        to="/about"
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          location.pathname === "/about"
            ? "text-indigo-600 bg-indigo-50"
            : "text-slate-700 hover:text-indigo-600"
        }`}
      >
        About Us
      </Link>

      {/* Services */}
      <Link
        to="/services"
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          location.pathname === "/services"
            ? "text-indigo-600 bg-indigo-50"
            : "text-slate-700 hover:text-indigo-600"
        }`}
      >
        Services
      </Link>

      {/* Products */}
      {/* <Link
        to="/products"
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          location.pathname === "/products"
            ? "text-indigo-600 bg-indigo-50"
            : "text-slate-700 hover:text-indigo-600"
        }`}
      >
        Products
      </Link> */}

      {/* Contact */}
      <Link
        to="/contact"
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          location.pathname === "/contact"
            ? "text-indigo-600 bg-indigo-50"
            : "text-slate-700 hover:text-indigo-600"
        }`}
      >
        Contact
      </Link>

      {/* Wishlist */}
      <Link
        to="/wishlist"
        className="relative px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-rose-500 transition-colors duration-200"
      >
        <Heart className="w-5 h-5" />
        {wishlistCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {wishlistCount}
          </span>
        )}
      </Link>

      {/* Cart */}
      <button
        onClick={onCartClick}
        className="relative px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors duration-200"
      >
        <ShoppingCart className="w-5 h-5" />
        {cartItemsCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {cartItemsCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default DesktopNav;
