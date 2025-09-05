// src/App.jsx
import React, { useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { CartProvider, useCart } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { Toaster } from "react-hot-toast";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import About from "./Components/pages/About/About";
import Services from "./Components/pages/services/ServicesSection";
import Products from "./Components/pages/products/ProductsGrid";
import Contact from "./Components/contact/ContactSection";
import Navbar from "./Components/pages/Navbar";
import Dashboard from "./Components/Auth/Dashboard";
import Modal from "./components/Modal";
import Home from "./Components/pages/Home";
import FoodMenu from "./Components/menu/FoodMenu";
import AuthPage from "./Components/Auth/AuthPage";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import AdminProtectedRoute from "./Components/Auth/AdminProtectedRoute";
import { Loader2 } from "lucide-react";
import AnimatedSection from "./components/AnimatedSection";
import AdminDashboard from "./admin/AdminDashboard";
import OrderForm from "./components/OrderForm";
import OrderConfirmation from "./Components/pages/OrderConfirmation";
import Checkout from "./Components/pages/Checkout";
import OrderSuccess from "./Components/pages/OrderSuccess";
import OrderFailed from "./Components/pages/OrderFailed";
import CartModal from "./Components/pages/cart/CartPage";

import WishlistPage from "./Components/WishlistPage";
import WishlistCounter from "./Components/WishlistCounter";

function AppWithCart() {
  // AuthContext must be available because AppWithCart is rendered inside AuthProvider
  const { user, logout, loading, isAdmin } = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // useCart will be available because AppWithCart will be rendered inside CartProvider
  const {
    cart = [],
    increaseQty,
    decreaseQty,
    removeItem,
    getCartItemsCount,
  } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {user && (
          <Navbar
            onProfileClick={() => setIsProfileOpen(true)}
            onCartClick={() => setIsCartOpen(true)}
            user={user}
            isAdmin={isAdmin}
            cartItemsCount={
              typeof getCartItemsCount === "function"
                ? getCartItemsCount()
                : cart.length || 0
            }
          />
        )}

        <Routes>
          <Route
            path="/auth"
            element={user ? <Navigate to="/" replace /> : <AuthPage />}
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/menu"
            element={
              <ProtectedRoute>
                <AnimatedSection
                  variant={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                >
                  <FoodMenu />
                </AnimatedSection>
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <Services />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />

          {/* Wishlist */}
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-failed"
            element={
              <ProtectedRoute>
                <OrderFailed />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AnimatedSection
                  variant={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                >
                  <AdminDashboard />
                </AnimatedSection>
              </AdminProtectedRoute>
            }
          />

          <Route path="/order" element={<OrderForm />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <CartModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cart || []}
          increaseQty={increaseQty}
          decreaseQty={decreaseQty}
          removeItem={removeItem}
        />

        {/* Wishlist counter floating button */}
        {user && <WishlistCounter />}

        <Toaster position="bottom-right" />

        {user && (
          <Modal
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            fullWidth={true}
          >
            <Dashboard user={user} onLogout={logout} />
          </Modal>
        )}
      </div>
    </Router>
  );
}

export default function App() {
  // Top-level: AuthProvider -> CartProvider -> WishlistProvider -> AppWithCart
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <AppWithCart />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
