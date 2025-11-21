import { motion } from "framer-motion";
import { stats } from "./data";

const Stats = () => (
  <motion.section
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="py-16 bg-white"
  >
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <motion.p
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
              className="text-3xl md:text-4xl font-bold text-blue-600 mb-2"
            >
              {stat.number}
            </motion.p>
            <p className="text-gray-600 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);

export default Stats;
