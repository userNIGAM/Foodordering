import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const Hero = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative py-20 px-4 mt-10 text-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
    >
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-4xl mx-auto">
        <motion.h1
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          Order
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xl md:text-2xl mb-8 opacity-90"
        >
          Empowering Restaurants with Digital Delivery Solutions
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg mb-8 max-w-2xl mx-auto"
        >
          <p>You have the kitchen, staff, and delivery setup.</p>
          <p>We provide the customers, platform, and online visibility.</p>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow flex items-center mx-auto"
          onClick={() =>
            toast("Join 300+ successful restaurant partners!", { icon: "👨‍🍳" })
          }
        >
          List Your Restaurant <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </motion.section>
  );
};

export default Hero;
