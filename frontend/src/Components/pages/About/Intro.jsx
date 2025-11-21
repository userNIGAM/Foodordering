import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const Intro = () => (
  <motion.section
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    className="py-20 px-4"
  >
    <div className="max-w-4xl mx-auto text-center">
      <motion.h2
        variants={itemVariants}
        className="text-4xl font-bold text-gray-800 mb-8"
      >
        Built for Established Food Businesses
      </motion.h2>
      <motion.p
        variants={itemVariants}
        className="text-lg text-gray-600 mb-6 leading-relaxed"
      >
        LocalEats Pro is specifically designed for restaurants, cafes, and
        established food businesses that already have kitchen infrastructure,
        staff, and delivery capabilities but struggle with online visibility and
        digital ordering systems.
      </motion.p>
      <motion.p
        variants={itemVariants}
        className="text-lg text-gray-600 leading-relaxed"
      >
        We understand that small and medium restaurants can't afford expensive
        website development, SEO agencies, or dedicated online ordering
        platforms. That's where we come in - providing the digital
        infrastructure you need to compete in today's market.
      </motion.p>
    </div>
  </motion.section>
);

export default Intro;
