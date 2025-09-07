import React, { createContext, useContext, useReducer, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

// Helper function to get consistent item ID
const getItemId = (item) => item.id || item._id;

// Cart reducer function
const cartReducer = (state, action) => {
  let newState;

  switch (action.type) {
    case "ADD_TO_CART":
      const itemId = getItemId(action.payload);
      const existingItem = state.find((item) => getItemId(item) === itemId);

      if (existingItem) {
        newState = state.map((item) =>
          getItemId(item) === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newState = [...state, { ...action.payload, quantity: 1 }];
      }
      break;

    case "INCREASE_QTY":
      newState = state.map((item) =>
        getItemId(item) === action.payload
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      break;

    case "DECREASE_QTY":
      newState = state.map((item) =>
        getItemId(item) === action.payload && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      break;

    case "REMOVE_ITEM":
      newState = state.filter((item) => getItemId(item) !== action.payload);
      break;

    case "CLEAR_CART":
      newState = [];
      break;

    case "LOAD_CART_FROM_STORAGE":
      newState = Array.isArray(action.payload) ? action.payload : [];
      break;

    default:
      newState = state;
  }

  // After any state change, save to localStorage
  if (action.type !== "LOAD_CART_FROM_STORAGE") {
    try {
      localStorage.setItem("cart", JSON.stringify(newState));
      // console.log("Cart saved to localStorage:", newState);
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }

  return newState;
};

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      // console.log("Loaded cart from storage:", parsedCart);
      // Ensure all items have proper structure
      return Array.isArray(parsedCart)
        ? parsedCart.map((item) => ({
            ...item,
            // Ensure quantity is always a number
            quantity: typeof item.quantity === "number" ? item.quantity : 1,
          }))
        : [];
    }
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
  }
  return [];
};

// Cart provider component
export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  // Load cart from localStorage on initial render
  useEffect(() => {
    // console.log("Loading cart from localStorage...");
    const loadedCart = loadCartFromStorage();
    // console.log("Loaded cart:", loadedCart);
    dispatch({ type: "LOAD_CART_FROM_STORAGE", payload: loadedCart });
  }, []);

  const addToCart = (product) => {
    // console.log("Adding to cart:", product);
    // Ensure the product has all required fields
    const cartProduct = {
      ...product,
      // Always preserve original _id if it exists (Mongo style)
      _id: product._id || product.id,
      id: product.id || product._id, // still keep id for reducer consistency
    };
    dispatch({ type: "ADD_TO_CART", payload: cartProduct });
    toast.success(`${product.name} added to cart!`);
  };

  const increaseQty = (itemId) => {
    dispatch({ type: "INCREASE_QTY", payload: itemId });
  };

  const decreaseQty = (itemId) => {
    dispatch({ type: "DECREASE_QTY", payload: itemId });
  };

  const removeItem = (itemId) => {
    dispatch({ type: "REMOVE_ITEM", payload: itemId });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getCartTotal = () => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce(
      (total, item) =>
        total + (parseFloat(item.price) || 0) * (item.quantity || 0),
      0
    );
  };

  const getCartItemsCount = () => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  // Debug function to check cart state
  const debugCart = () => {
    console.log("Current cart state:", cart);
    console.log("LocalStorage cart:", localStorage.getItem("cart"));
  };

  return (
    <CartContext.Provider
      value={{
        cart: cart || [],
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        debugCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
