// src/components/auth/Logout.jsx
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";

const Logout = ({ className = "" }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true } // send cookies
      );

      // Clear any stored user/admin info
      localStorage.removeItem("admin");
      // Redirect to login page
      navigate("/auth");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <motion.button
      onClick={handleLogout}
      whileHover={{ scale: 1.05, x: 5 }} // desktop hover
      whileTap={{ scale: 0.95, backgroundColor: "#fee2e2" }} // mobile tap
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`flex items-center w-full px-4 py-3 rounded-lg 
        bg-white text-gray-700 shadow-sm hover:bg-gray-50 
        active:bg-red-50 active:shadow-inner transition-all duration-200 ${className}`}
    >
      <LogOut className="w-5 h-5 mr-3 text-red-500" />
      <span className="font-medium">Logout</span>
    </motion.button>
  );
};

export default Logout;
