import React from "react";

const MenuItemCard = ({ item, addToCart }) => (
  <div className="bg-white rounded-lg shadow-md p-4">
    <img
      src={item.image}
      alt={item.name}
      className="w-full h-40 object-cover rounded-md mb-3"
    />
    <h3 className="text-lg font-semibold">{item.name}</h3>
    <p className="text-gray-600 text-sm mb-2">{item.description}</p>

    <div className="flex justify-between items-center">
      <span className="font-bold">${item.price}</span>
      <button
        onClick={() => addToCart(item)}
        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  </div>
);

export default MenuItemCard;
