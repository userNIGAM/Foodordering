import React, { useState, useEffect } from "react";
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  Briefcase,
  Info,
  Mail,
  User,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({
  onProfileClick,
  onCartClick,
  user,
  isAdmin,
  cartItemsCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll event to add shadow and background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking on a link
  const handleNavClick = () => {
    if (isOpen) setIsOpen(false);
  };

  // Navigation items data
  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Products", icon: ShoppingBag, path: "/#products" },
    { name: "Services", icon: Briefcase, path: "/#services" },
    { name: "About Us", icon: Info, path: "/#about" },
    { name: "Contact", icon: Mail, path: "/#contact" },
    { name: "Menu", icon: Menu, path: "/menu" },
  ];

  // Helper function to handle hash links
  const handleHashLink = (path, e) => {
    if (path.includes("#")) {
      e.preventDefault();
      const [basePath, hash] = path.split("#");

      // If we're already on the home page, just scroll to section
      if (location.pathname === "/") {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Navigate to home page first, then scroll to section
        window.location.href = path;
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-none shadow-md py-2"
          : "bg-white py-4"
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-indigo-700">
              Order
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return item.path.includes("#") ? (
                  <a
                    key={item.name}
                    href={item.path}
                    onClick={(e) => handleHashLink(item.path, e)}
                    className="text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center group"
                    aria-label={`Navigate to ${item.name}`}
                  >
                    <Icon className="h-4 w-4 mr-2 opacity-70 group-hover:opacity-100" />
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center group"
                    aria-label={`Navigate to ${item.name}`}
                  >
                    <Icon className="h-4 w-4 mr-2 opacity-70 group-hover:opacity-100" />
                    {item.name}
                  </Link>
                );
              })}

              {/* Cart Icon for Desktop */}
              <button
                onClick={onCartClick}
                className="text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center group relative"
                aria-label="Open shopping cart"
              >
                <ShoppingCart className="h-4 w-4 mr-2 opacity-70 group-hover:opacity-100" />
                Cart
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Profile and Cart Section (Desktop) */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <button
                onClick={onProfileClick}
                className="p-2 rounded-full text-slate-700 hover:text-indigo-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                aria-label="Open profile menu"
              >
                <User className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-indigo-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              aria-expanded="false"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 h-auto visible"
            : "opacity-0 h-0 invisible overflow-hidden"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
          {navItems.map((item) => {
            const Icon = item.icon;
            return item.path.includes("#") ? (
              <a
                key={item.name}
                href={item.path}
                onClick={(e) => {
                  handleHashLink(item.path, e);
                  handleNavClick();
                }}
                className="text-slate-700 hover:text-indigo-600 hover:bg-slate-50 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center"
                aria-label={`Navigate to ${item.name}`}
              >
                <Icon className="h-5 w-5 mr-3 opacity-70" />
                {item.name}
              </a>
            ) : (
              <Link
                key={item.name}
                to={item.path}
                onClick={handleNavClick}
                className="text-slate-700 hover:text-indigo-600 hover:bg-slate-50 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center"
                aria-label={`Navigate to ${item.name}`}
              >
                <Icon className="h-5 w-5 mr-3 opacity-70" />
                {item.name}
              </Link>
            );
          })}

          {/* Cart for Mobile */}
          <button
            onClick={() => {
              onCartClick();
              handleNavClick();
            }}
            className="w-full text-left text-slate-700 hover:text-indigo-600 hover:bg-slate-50 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center relative"
            aria-label="Open shopping cart"
          >
            <ShoppingCart className="h-5 w-5 mr-3 opacity-70" />
            Cart
            {cartItemsCount > 0 && (
              <span className="ml-auto bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Admin Dashboard
            </Link>
          )}

          <button
            onClick={() => {
              onProfileClick();
              handleNavClick();
            }}
            className="w-full text-left text-slate-700 hover:text-indigo-600 hover:bg-slate-50 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center"
            aria-label="Open profile menu"
          >
            <User className="h-5 w-5 mr-3 opacity-70" />
            Profile
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
