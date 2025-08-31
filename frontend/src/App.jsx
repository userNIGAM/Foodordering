// src/App.jsx
import React, { useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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

function AppContent() {
  const { user, logout, loading, isAdmin } = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <CartProvider>
      <Router>
        <div className="App">
          {user && (
            <Navbar
              onProfileClick={() => setIsProfileOpen(true)}
              user={user}
              isAdmin={isAdmin}
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
