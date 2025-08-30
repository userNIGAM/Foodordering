// components/AnimatedSection.jsx
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const AnimatedSection = ({ children, variant, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variant}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
