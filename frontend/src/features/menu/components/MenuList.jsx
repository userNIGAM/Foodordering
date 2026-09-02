import React from "react";
import MenuItemCard from "./MenuItemCard";

const MenuList = ({ items, addToCart }) => (
  <div className="lg:col-span-2">
    <h2 className="text-2xl font-semibold mb-4">Menu Items</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item) => (
        <MenuItemCard key={item._id} item={item} addToCart={addToCart} />
      ))}
    </div>
  </div>
);

export default MenuList;
