import React, { useState, useEffect } from "react";
import { ChefHat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import tipsData from "./tipsData";

const ChefTip = ({ isVisible }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % tipsData.length);
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <div className="flex items-center bg-orange-50 p-4 rounded-lg overflow-hidden">
      <div className="bg-orange-100 p-3 rounded-full mr-4 flex-shrink-0">
        <ChefHat className="text-orange-600" size={20} />
      </div>

      <div className="relative h-6 flex items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="text-sm text-orange-800"
          >
            <span className="font-medium">Chef's Tip:</span> {tipsData[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChefTip;
