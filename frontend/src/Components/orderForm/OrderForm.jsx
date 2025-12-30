import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import MenuList from "./MenuList";
import Cart from "./Cart";
import CustomerForm from "./CustomerForm";

const OrderForm = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    specialInstructions: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await api.get("/api/menu-items");
        setMenuItems(response.data.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);

  const addToCart = (item) => {
    const existing = cart.find((c) => c._id === item._id);
    if (existing) {
      setCart(
        cart.map((c) =>
          c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) =>
    setCart(cart.filter((i) => i._id !== id));

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id);
    setCart(
      cart.map((i) =>
        i._id === id ? { ...i, quantity } : i
      )
    );
  };

  const calculateTotal = () =>
    cart
      .reduce((t, i) => t + i.price * i.quantity, 0)
      .toFixed(2);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart.length) return alert("Please add items first.");

    setIsSubmitting(true);
    try {
      const payload = {
        customer: customerInfo,
        items: cart,
        total: calculateTotal(),
        status: "pending",
      };

      const res = await api.post("/api/orders", payload);

      if (res.data.success) {
        alert("Order placed successfully!");
        setCart([]);
        setCustomerInfo({
          name: "",
          email: "",
          phone: "",
          address: "",
          specialInstructions: "",
        });
        navigate("/order-confirmation", {
          state: { orderId: res.data.orderId },
        });
      }
    } catch (e) {
      console.error(e);
      alert("Error placing order — try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Place Your Order
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <MenuList items={menuItems} addToCart={addToCart} />

          <div className="bg-white rounded-lg shadow-md p-6">
            <Cart
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              total={calculateTotal()}
            />

            {cart.length > 0 && (
              <CustomerForm
                customer={customerInfo}
                onChange={handleInputChange}
                onSubmit={handleSubmit}
                disabled={isSubmitting || cart.length === 0}
                submitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
