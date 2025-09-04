import React from "react";
import { Link } from "react-router-dom";

const Logo = () => (
  <div className="flex-shrink-0">
    <Link to="/" className="text-2xl font-bold text-indigo-700">
      Order
    </Link>
  </div>
);

export default Logo;
