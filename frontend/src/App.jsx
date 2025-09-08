// src/App.jsx
import React, { useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import { CartProvider, useCart } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { Toaster } from "react-hot-toast";
import { AuthProvider, AuthContext } from "./context/AuthContext";

import About from "./Components/pages/About/About";
import Services from "./Components/pages/services/ServicesSection";
// import Products from "./Components/pages/products/ProductsGrid";
import Contact from "./Components/contact/ContactSection";
import Navbar from "./Components/pages/Navbar";
import Dashboard from "./Components/Auth/Dashboard";
import Modal from "./components/Modal";
import Home from "./Components/pages/Home";
import FoodMenu from "./Components/menu/FoodMenu";
import AuthPage from "./Components/Auth/AuthPage";
import AdminProtectedRoute from "./Components/Auth/AdminProtectedRoute";
import { Loader2 } from "lucide-react";
import AnimatedSection from "./Components/AnimatedSection";
import AdminDashboard from "./admin/AdminDashboard";
import OrderForm from "./components/OrderForm";
import OrderConfirmation from "./Components/pages/OrderConfirmation";
import Checkout from "./Components/pages/Checkout";
import OrderSuccess from "./Components/pages/OrderSuccess";
import OrderFailed from "./Components/pages/OrderFailed";
import CartModal from "./Components/pages/cart/CartPage";
import WishlistPage from "./Components/WishlistPage";
import WishlistCounter from "./Components/WishlistCounter";
import MainLayout from "./Components/layout/MainLayout";
import ScrollToTop from "./Components/scroll/ScrollToTop";

// ---------------------------
// Layout wrapper with Navbar + Modals
// ---------------------------
function AppLayout() {
  const { user, logout, loading, isAdmin } = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
    <MainLayout>
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

      {/* Floating wishlist button */}
      <WishlistCounter />

      {/* Render the nested route */}
      <Outlet />

      {/* Cart modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart || []}
        increaseQty={increaseQty}
        decreaseQty={decreaseQty}
        removeItem={removeItem}
      />

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
    </MainLayout>
  );
}

// ---------------------------
// Routes
// ---------------------------
function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public route */}
      <Route
        path="/auth"
        element={user ? <Navigate to="/" replace /> : <AuthPage />}
      />

      {/* Protected routes */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/menu"
          element={
            <AnimatedSection
              variant={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              <FoodMenu />
            </AnimatedSection>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/order-failed" element={<OrderFailed />} />
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

// ---------------------------
// Providers Wrapper
// ---------------------------
function AppWithProviders() {
  return (
    <CartProvider>
      <WishlistProvider>
        <AppRoutes />
      </WishlistProvider>
    </CartProvider>
  );
}

// ---------------------------
// Root App
// ---------------------------
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppWithProviders />
      </Router>
    </AuthProvider>
  );
}
