// src/App.jsx
import React, { useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import { CartProvider, useCart } from "./features/cart/CartContext";
import { WishlistProvider } from "./features/wishlist/WishlistContext";
import { Toaster } from "react-hot-toast";
import { AuthProvider, AuthContext } from "./features/Auth/AuthContext";

import About from "./pages/about/About";
import Services from "./pages/services/ServicesSection";
import Contact from "./pages/contact/Contact";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./features/page/Dashboard";
import Modal from "./components/ui/Modal";
import Home from "./pages/home/Home";
import FoodMenu from "./features/menu/components/FoodMenu";
import FoodDetail from "./features/menu/components/details/FoodDetail";
import AuthPage from "./features/Auth/components/AuthPage";
import AdminProtectedRoute from "./features/Auth/components/AdminProtectedRoute";
import KitchenProtectedRoute from "./features/Auth/components/KitchenProtectedRoute";
import DeliveryProtectedRoute from "./features/Auth/components/DeliveryProtectedRoute";
import { Loader2 } from "lucide-react";
import AnimatedSection from "./components/common/AnimatedSection";
import AdminDashboard from "./admin/dashboard/AdminDashboard";
import KitchenStaffDashboard from "./kitchen/pages/KitchenStaffDashboard";
import DeliveryStaffDashboard from "./delivery/pages/DeliveryStaffDashboard";
import { roleRedirects } from "./features/Auth/roleRedirects";
import OrderForm from "./features/orders/components/OrderForm";
import OrderConfirmation from "./features/orders/components/OrderConfirmation";
import Checkout from "./features/checkout/components/Checkout";
import OrderSuccess from "./features/orders/components/OrderSuccess";
import OrderFailed from "./features/orders/components/OrderFailed";
import CartModal from "./features/cart/components/CartPage";
import UserOrders from "./features/orders/components/UserOrders";
import WishlistPage from "./features/wishlist/WishlistPage";
import WishlistCounter from "./features/wishlist/WishlistCounter";
import MainLayout from "./components/layout/MainLayout";
import ScrollToTop from "./components/layout/ScrollToTop";
import { ThemeProvider } from "./features/Auth/contexts/ThemeContext";
import PaymentSuccess from "./features/checkout/components/PaymentSuccess";
import PaymentFailed from "./features/checkout/components/PaymentFailed";

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
      <div className="min-h-screen grid place-items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300">
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
    </div>
  );
}

// ---------------------------
// Routes
// ---------------------------
function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public auth route */}
      <Route
        path="/auth"
        element={user ? <Navigate to={roleRedirects[user.role] || "/"} replace /> : <AuthPage />}
      />

      {/* ---------------------- */}
      {/* Admin routes (NO Navbar) */}
      {/* ---------------------- */}
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

      {/* ---------------------- */}
      {/* Kitchen Staff routes (NO Navbar) */}
      {/* ---------------------- */}
      <Route
        path="/kitchen/dashboard"
        element={
          <KitchenProtectedRoute>
            <AnimatedSection
              variant={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              <KitchenStaffDashboard />
            </AnimatedSection>
          </KitchenProtectedRoute>
        }
      />

      {/* ---------------------- */}
      {/* Delivery Staff routes (NO Navbar) */}
      {/* ---------------------- */}
      <Route
        path="/delivery/dashboard"
        element={
          <DeliveryProtectedRoute>
            <AnimatedSection
              variant={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              <DeliveryStaffDashboard />
            </AnimatedSection>
          </DeliveryProtectedRoute>
        }
      />

      {/* ---------------------- */}
      {/* User routes WITH Navbar */}
      {/* ---------------------- */}
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
        <Route
          path="/menu/:id"
          element={
            <AnimatedSection
              variant={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              <FoodDetail />
            </AnimatedSection>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/orders" element={<UserOrders />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/order-failed" element={<OrderFailed />} />
        <Route path="/order" element={<OrderForm />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        {/* eSewa payment success and failure routes */}
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
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
      <ThemeProvider>
        <Router>
          <ScrollToTop />
          <AppWithProviders />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}
