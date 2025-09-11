import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
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

  // Save to localStorage after any change except initial load
  if (action.type !== "LOAD_CART_FROM_STORAGE") {
    try {
      localStorage.setItem("cart", JSON.stringify(newState));
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
      return Array.isArray(parsedCart)
        ? parsedCart.map((item) => ({
            ...item,
            quantity: typeof item.quantity === "number" ? item.quantity : 1,
          }))
        : [];
    }
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
  }
  return [];
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const loadedCart = loadCartFromStorage();
    dispatch({ type: "LOAD_CART_FROM_STORAGE", payload: loadedCart });
  }, []);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addToCart = (product) => {
    const cartProduct = {
      ...product,
      _id: product._id || product.id,
      id: product.id || product._id,
      quantity: product.quantity || 1,
    };
    dispatch({ type: "ADD_TO_CART", payload: cartProduct });
    toast.success(`${product.name} added to cart!`);
    openCart(); // 👈 open modal when item added
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

  const getCartTotal = () =>
    Array.isArray(cart)
      ? cart.reduce(
          (total, item) =>
            total + (parseFloat(item.price) || 0) * (item.quantity || 0),
          0
        )
      : 0;

  const getCartItemsCount = () =>
    Array.isArray(cart)
      ? cart.reduce((total, item) => total + (item.quantity || 0), 0)
      : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
