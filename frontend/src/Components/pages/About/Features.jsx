import { motion } from "framer-motion";
import { features } from "./data";

const Features = ({ activeFeature, setActiveFeature, cardVariants }) => (
  //   <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
  //     <div className="max-w-6xl mx-auto px-4">
  //       <motion.h2
  //         initial={{ opacity: 0 }}
  //         whileInView={{ opacity: 1 }}
  //         className="text-4xl font-bold text-center text-gray-800 mb-12"
  //       >
  //         How We Help Your Business
  //       </motion.h2>

  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
  //         {features.map((feature, index) => (
  //           <motion.div
  //             key={feature.title}
  //             variants={cardVariants}
  //             initial="hidden"
  //             whileInView="visible"
  //             whileHover="hover"
  //             viewport={{ once: true }}
  //             className={`bg-gradient-to-br ${feature.color} p-6 rounded-2xl text-white shadow-lg cursor-pointer`}
  //             onMouseEnter={() => setActiveFeature(index)}
  //           >
  //             <motion.div
  //               animate={{
  //                 rotate: activeFeature === index ? [0, -10, 10, 0] : 0,
  //               }}
  //               transition={{ duration: 0.5 }}
  //               className="mb-4"
  //             >
  //               {feature.icon}
  //             </motion.div>
  //             <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
  //             <p className="opacity-90">{feature.description}</p>
  //           </motion.div>
  //         ))}
  //       </div>
  //     </div>
  //   </section>
  <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
    <div className="max-w-6xl mx-auto px-4">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-4xl font-bold text-center text-gray-800 mb-12"
      >
        How We Help Your Business
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true }}
            className={`bg-gradient-to-br ${feature.color} p-6 rounded-2xl text-white shadow-lg cursor-pointer`}
            onMouseEnter={() => setActiveFeature(index)}
          >
            <motion.div
              animate={{
                rotate: activeFeature === index ? [0, -10, 10, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              {feature.icon}
            </motion.div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="opacity-90">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
