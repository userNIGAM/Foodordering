import React, { useState } from "react";
import Navbar from "./Components/pages/Navbar";
import Dashboard from "./Components/Dashboard";
import Modal from "./components/Modal";
import Home from "./Components/pages/Home";
import { CartProvider } from "./contexts/CartContext";
import ProductsGrid from "./Components/pages/products/ProductsGrid";

function App() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    isVerified: true,
  });

  return (
    <CartProvider>
      {" "}
      {/* Move CartProvider to wrap ALL components */}
      <div className="App">
        <Navbar />
        <Home /> {/* Home is now inside CartProvider */}
        <ProductsGrid />
      </div>
      {/* Dashboard Modal */}
      <Modal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)}>
        <Dashboard user={user} onLogout={() => setIsProfileOpen(false)} />
      </Modal>
    </CartProvider>
  );
}

export default App;
