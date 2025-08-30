// src/contexts/CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

// Cart reducer function
const cartReducer = (state, action) => {
  let newState;

  switch (action.type) {
    case "ADD_TO_CART":
      // Check if item already exists in cart
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        newState = {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        newState = {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
        };
      }
      return newState;

    case "INCREASE_QTY":
      newState = {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
      return newState;

    case "DECREASE_QTY":
      newState = {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      };
      return newState;

    case "REMOVE_ITEM":
      newState = {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
      // console.log("Updated cart state:", newState);
      return newState;

    case "CLEAR_CART":
      newState = {
        ...state,
        items: [],
      };
      return newState;

    case "LOAD_CART_FROM_STORAGE":
      // Ensure the loaded state has the correct structure
      return {
        items: Array.isArray(action.payload.items) ? action.payload.items : [],
      };

    default:
      return state;
  }
};

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);

      // Ensure the parsed cart has the correct structure
      return {
        items: Array.isArray(parsedCart.items) ? parsedCart.items : [],
      };
    }
  } catch (error) {
    // console.error("Error loading cart from localStorage:", error);
  }
  return { items: [] };
};

// Cart provider component
export const CartProvider = ({ children }) => {
  // Initialize with a default state that has the correct structure
  const [cartState, dispatch] = useReducer(cartReducer, { items: [] }, () => {
    // Initialize state from localStorage
    const loadedState = loadCartFromStorage();
    return loadedState;
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartState));
      // console.log("Saved cart to localStorage:", cartState);
    } catch (error) {
      // console.error("Error saving cart to localStorage:", error);
    }
  }, [cartState]);

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
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
    if (!cartState.items || !Array.isArray(cartState.items)) {
      return 0;
    }
    return cartState.items.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 0),
      0
    );
  };

  const getCartItemsCount = () => {
    if (!cartState.items || !Array.isArray(cartState.items)) {
      return 0;
    }
    return cartState.items.reduce(
      (total, item) => total + (item.quantity || 0),
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        items: cartState.items || [],
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart,
        getCartTotal,
        getCartItemsCount,
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
