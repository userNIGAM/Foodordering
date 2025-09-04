import React from "react";
import { Link } from "react-router-dom";
import { navItems } from "./NavItems";
import CartButton from "./CartButton";

const DesktopNav = ({ location, onCartClick, cartItemsCount }) => {
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
            >
              <Icon className="h-4 w-4 mr-2 opacity-70 group-hover:opacity-100" />
              {item.name}
            </a>
          ) : (
            <Link
              key={item.name}
              to={item.path}
              className="text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center group"
            >
              <Icon className="h-4 w-4 mr-2 opacity-70 group-hover:opacity-100" />
              {item.name}
            </Link>
          );
        })}
        <CartButton onClick={onCartClick} cartItemsCount={cartItemsCount} />
      </div>
    </div>
  );
};

export default DesktopNav;
