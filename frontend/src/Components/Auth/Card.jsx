import React from "react";
import { motion } from "framer-motion";

const Card = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ type: "spring", stiffness: 120, damping: 14 }}
    className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl backdrop-blur-md"
  >
    {children}
  </motion.div>
);

export default Card;
