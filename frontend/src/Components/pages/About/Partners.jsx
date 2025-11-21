import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Clock,
  Users,
  Truck,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { partners } from "./data";

const Partners = ({
  displayedPartners,
  showAllPartners,
  setShowAllPartners,
  containerVariants,
  cardVariants,
}) => (
  <section className="py-20 px-4">
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Our Success Stories
        </h2>
        <p className="text-xl text-gray-600">
          Established restaurants that transformed their delivery business with
          us
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        <AnimatePresence>
          {displayedPartners.map((partner) => (
            <motion.div
              key={partner.id}
              variants={cardVariants}
              layout
              whileHover="hover"
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{partner.image}</div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center bg-blue-100 text-blue-600 px-3 py-1 rounded-full"
                  >
                    <Star className="w-4 h-4 fill-current mr-1" />
                    <span className="font-semibold">{partner.rating}</span>
                  </motion.div>
                </div>

                <div className="mb-3">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {partner.name}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {partner.type} • Since {partner.since}
                  </p>
                </div>

                <p className="text-gray-600 mb-3 italic">{partner.specialty}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Truck className="w-4 h-4 mr-2" />
                    {partner.deliverySetup}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Shield className="w-4 h-4 mr-2" />
                    Previously: {partner.challenge}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {partner.deliveryTime}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1 text-green-500" />
                    {partner.orders} orders
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {partner.tags.slice(0, 2).map((tag, index) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                  onClick={() =>
                    toast.success(`Viewing ${partner.name} menu!`, {
                      icon: "📋",
                    })
                  }
                >
                  Order Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAllPartners(!showAllPartners)}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all flex items-center mx-auto"
        >
          {showAllPartners ? (
            <>
              Show Less <ChevronUp className="w-5 h-5 ml-2" />
            </>
          ) : (
            <>
              Show More Success Stories <ChevronDown className="w-5 h-5 ml-2" />
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  </section>
);

export default Partners;
