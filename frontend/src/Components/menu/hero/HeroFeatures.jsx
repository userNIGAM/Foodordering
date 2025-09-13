import { Truck, Shield, Clock } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "../../AnimatedSection";
import { badgeVariant } from "./variants";

const features = [
  { icon: Truck, text: "Free delivery over $25" },
  { icon: Clock, text: "30-min average delivery" },
  { icon: Shield, text: "Contactless delivery" },
];

export default function HeroFeatures() {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <AnimatedSection
            key={index}
            variant={badgeVariant}
            custom={index}
            className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full cursor-pointer backdrop-blur-md shadow-md"
          >
            <motion.div
              className="mr-2 text-yellow-400"
              animate={{ y: [0, -5, 0], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Icon size={20} />
            </motion.div>
            <span className="text-black font-medium">{feature.text}</span>
          </AnimatedSection>
        );
      })}
    </div>
  );
}
