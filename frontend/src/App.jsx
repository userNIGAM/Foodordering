// src/App.jsx
import React, { useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useCart } from "./contexts/CartContext";
import { CartProvider } from "./contexts/CartContext";
import { Toaster } from "react-hot-toast";
import { AuthProvider, AuthContext } from "./context/AuthContext";
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

// Create a separate component that uses the cart
function AppWithCart() {
  const { user, logout, loading, isAdmin } = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Import useCart here, inside the CartProvider
  const { cart, increaseQty, decreaseQty, removeItem, getCartItemsCount } =
    useCart();

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
            cartItemsCount={getCartItemsCount()}
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
                  variant={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                  }}
                >
                  <FoodMenu />
                </AnimatedSection>
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
                  variant={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                  }}
                >
                  <AdminDashboard />
                </AnimatedSection>
              </AdminProtectedRoute>
            }
          />

          {/* Redirect any unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/order" element={<OrderForm />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
        </Routes>

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
      </div>
    </Router>
  );
}

function AppContent() {
  return (
    <CartProvider>
      <AppWithCart />
    </CartProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
