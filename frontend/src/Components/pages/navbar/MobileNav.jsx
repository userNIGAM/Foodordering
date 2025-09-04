import React from "react";
import { Link } from "react-router-dom";
import { User, ShoppingCart } from "lucide-react";
import { navItems } from "./NavItems";

const MobileNav = ({
  isOpen,
  location,
  onCartClick,
  cartItemsCount,
  onProfileClick,
  handleNavClick,
  isAdmin,
}) => {
  const handleHashLink = (path, e) => {
    if (path.includes("#")) {
      e.preventDefault();
      const [, hash] = path.split("#");
      if (location.pathname === "/") {
        const element = document.getElementById(hash);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = path;
      }
    }
  };

  return (
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
            >
              <Icon className="h-5 w-5 mr-3 opacity-70" />
              {item.name}
            </Link>
          );
        })}

        {/* Cart */}
        <button
          onClick={() => {
            onCartClick();
            handleNavClick();
          }}
          className="w-full text-left text-slate-700 hover:text-indigo-600 hover:bg-slate-50 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center relative"
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
            onClick={handleNavClick}
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
        >
          <User className="h-5 w-5 mr-3 opacity-70" />
          Profile
        </button>
      </div>
    </div>
  );
};

export default MobileNav;
