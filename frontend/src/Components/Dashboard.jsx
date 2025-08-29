import React from "react";
import { motion } from "framer-motion";
import { LogOut, User, Mail, ShieldCheck } from "lucide-react";
import api from "../services/api";

const Dashboard = ({ user, onLogout }) => {
  const handleLogout = async () => {
    try {
      await api.post("api/auth/logout");
      onLogout();
    } catch (err) {
      console.error("Logout error:", err);
      // Still logout even if API call fails
      onLogout();
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100 p-4 rounded-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <User className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Welcome back!
          </h1>
          <p className="text-slate-600">You have successfully authenticated</p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-slate-500 mr-3" />
            <div>
              <p className="text-sm text-slate-500">Name</p>
              <p className="font-medium text-slate-800">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center mb-4">
            <Mail className="w-5 h-5 text-slate-500 mr-3" />
            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="font-medium text-slate-800">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center">
            <ShieldCheck className="w-5 h-5 text-slate-500 mr-3" />
            <div>
              <p className="text-sm text-slate-500">Status</p>
              <p className="font-medium text-slate-800">
                {user?.isVerified ? "Verified" : "Not Verified"}
              </p>
            </div>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-800 px-4 py-3 font-semibold text-white shadow-lg transition hover:bg-slate-900"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Dashboard;
