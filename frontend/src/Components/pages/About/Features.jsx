import { motion } from "framer-motion";
import { Target, Zap, Building, ChefHat } from "lucide-react";

export const features = [
  {
    icon: <Target className="w-8 h-8" />,
    title: "For Established Restaurants",
    description:
      "You have the kitchen, staff, and delivery setup. We provide the customers and ordering platform.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Instant Online Presence",
    description:
      "Get listed immediately without waiting for website development or SEO optimization",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: <Building className="w-8 h-8" />,
    title: "Professional Platform",
    description:
      "Maintain your restaurant's professional image with our premium ordering system",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: <ChefHat className="w-8 h-8" />,
    title: "Focus on Cooking",
    description:
      "Concentrate on your food while we handle orders, payments, and customer management",
    color: "from-green-500 to-teal-500",
  },
];
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
