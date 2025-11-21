import { motion } from "framer-motion";
import toast from "react-hot-toast";

const CTA = () => (
  <motion.section
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
  >
    <div className="max-w-4xl mx-auto px-4 text-center">
      <motion.h2
        initial={{ y: 20 }}
        whileInView={{ y: 0 }}
        className="text-4xl font-bold mb-8"
      >
        Ready to Boost Your Orders?
      </motion.h2>

      <motion.p
        initial={{ y: 20 }}
        whileInView={{ y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl leading-relaxed opacity-90 mb-8"
      >
        Join hundreds of successful restaurants that have transformed their
        delivery business. Zero setup costs, professional platform, and access
        to thousands of hungry customers.
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
        onClick={() => toast("Application process started!", { icon: "📝" })}
      >
        Apply as Restaurant Partner
      </motion.button>
    </div>
  </motion.section>
);

export default CTA;
