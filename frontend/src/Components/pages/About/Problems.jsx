import { motion } from "framer-motion";
import { problemsWeSolve } from "./data";

const Problems = () => (
  <section className="py-20 bg-white">
    <div className="max-w-6xl mx-auto px-4">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-4xl font-bold text-center text-gray-800 mb-12"
      >
        Challenges We Solve
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {problemsWeSolve.map((item, index) => (
          <motion.div
            key={item.problem}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-gray-50 p-6 rounded-2xl border border-gray-200"
          >
            <div className="flex items-start space-x-4">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.problem}
                </h3>
                <p className="text-blue-600 font-medium">{item.solution}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Problems;
