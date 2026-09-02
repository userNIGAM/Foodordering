import React from "react";
import { Link } from "react-router-dom";

export default function Breadcrumb({ itemName }) {
  return (
    <nav className="flex mb-6 text-sm text-gray-500">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="hover:text-indigo-600">
            Home
          </Link>
        </li>
        <li className="before:content-['/'] before:mx-2">
          <Link to="/menu" className="hover:text-indigo-600">
            Menu
          </Link>
        </li>
        <li className="before:content-['/'] before:mx-2 text-gray-800 truncate">
          {itemName}
        </li>
      </ol>
    </nav>
  );
}
