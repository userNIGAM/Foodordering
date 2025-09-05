import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, User } from "lucide-react";

const MobileNav = ({
  isOpen,
  location,
  onCartClick,
  cartItemsCount,
  wishlistCount,
  onProfileClick,
  handleNavClick,
  isAdmin,
}) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white border-t border-slate-200 shadow-lg">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {/* Home */}
        <Link
          to="/"
          className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
            location.pathname === "/"
              ? "text-indigo-600 bg-indigo-50"
              : "text-slate-700 hover:text-indigo-600 hover:bg-slate-100"
          }`}
          onClick={handleNavClick}
        >
          Home
        </Link>

        {/* Menu */}
        <Link
          to="/menu"
          className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
            location.pathname === "/menu"
              ? "text-indigo-600 bg-indigo-50"
              : "text-slate-700 hover:text-indigo-600 hover:bg-slate-100"
          }`}
          onClick={handleNavClick}
        >
          Menu
        </Link>

        {/* About Us */}
        <Link
          to="/about"
          className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
            location.pathname === "/about"
              ? "text-indigo-600 bg-indigo-50"
              : "text-slate-700 hover:text-indigo-600 hover:bg-slate-100"
          }`}
          onClick={handleNavClick}
        >
          About Us
        </Link>

        {/* Services */}
        <Link
          to="/services"
          className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
            location.pathname === "/services"
              ? "text-indigo-600 bg-indigo-50"
              : "text-slate-700 hover:text-indigo-600 hover:bg-slate-100"
          }`}
          onClick={handleNavClick}
        >
          Services
        </Link>

        {/* Products */}
        <Link
          to="/products"
          className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
            location.pathname === "/products"
              ? "text-indigo-600 bg-indigo-50"
              : "text-slate-700 hover:text-indigo-600 hover:bg-slate-100"
          }`}
          onClick={handleNavClick}
        >
          Products
        </Link>

        {/* Contact */}
        <Link
          to="/contact"
          className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
            location.pathname === "/contact"
              ? "text-indigo-600 bg-indigo-50"
              : "text-slate-700 hover:text-indigo-600 hover:bg-slate-100"
          }`}
          onClick={handleNavClick}
        >
          Contact
        </Link>

        {/* Wishlist */}
        <Link
          to="/wishlist"
          className="flex items-center px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-rose-500 hover:bg-slate-100 transition-colors duration-200 relative"
          onClick={handleNavClick}
        >
          <Heart className="w-5 h-5 mr-2" />
          Wishlist
          {wishlistCount > 0 && (
            <span className="ml-2 bg-rose-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </Link>

        {/* Cart */}
        <button
          onClick={() => {
            onCartClick();
            handleNavClick();
          }}
          className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors duration-200 relative"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Cart
          {cartItemsCount > 0 && (
            <span className="ml-2 bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartItemsCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <button
          onClick={() => {
            onProfileClick();
            handleNavClick();
          }}
          className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors duration-200"
        >
          <User className="w-5 h-5 mr-2" />
          Profile
        </button>

        {/* Admin Dashboard */}
        {isAdmin && (
          <Link
            to="/admin/dashboard"
            className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
              location.pathname === "/admin/dashboard"
                ? "text-indigo-600 bg-indigo-50"
                : "text-slate-700 hover:text-indigo-600 hover:bg-slate-100"
            }`}
            onClick={handleNavClick}
          >
            Admin Dashboard
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileNav;
