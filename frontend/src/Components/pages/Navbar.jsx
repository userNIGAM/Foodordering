import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

import Logo from "./navbar/Logo";
import DesktopNav from "./navbar/DesktopNav";
import MobileNav from "./navbar/MobileNav";
import ProfileButton from "./navbar/ProfileButton";
import CartButton from "./navbar/CartButton";

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = () => {
    if (isOpen) setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-none shadow-md py-2"
          : "bg-gradient-to-br from-slate-100 to-slate-400 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Nav */}
          <DesktopNav
            location={location}
            onCartClick={onCartClick}
            cartItemsCount={cartItemsCount}
          />

          {/* Profile Btn (desktop) */}
          <div className="hidden md:block">
            <ProfileButton onClick={onProfileClick} />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-indigo-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
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

      {/* Mobile Nav */}
      <MobileNav
        isOpen={isOpen}
        location={location}
        onCartClick={onCartClick}
        cartItemsCount={cartItemsCount}
        onProfileClick={onProfileClick}
        handleNavClick={handleNavClick}
        isAdmin={isAdmin}
      />
    </nav>
  );
};

export default Navbar;
