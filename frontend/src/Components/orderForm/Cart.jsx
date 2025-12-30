import React from "react";
import CartItem from "./CartItem";

const Cart = ({ cart, updateQuantity, removeFromCart, total }) => (
  <>
    <h2 className="text-2xl font-semibold mb-4">Your Order</h2>

    {cart.length === 0 ? (
      <p className="text-gray-500">Your cart is empty</p>
    ) : (
      <>
        <div className="mb-6">
          {cart.map((item) => (
            <CartItem
              key={item._id}
              item={item}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
          ))}

          <div className="flex justify-between mt-4 pt-4 border-t">
            <span className="font-bold">Total:</span>
            <span className="font-bold">${total}</span>
          </div>
        </div>
      </>
    )}
  </>
);

export default Cart;
