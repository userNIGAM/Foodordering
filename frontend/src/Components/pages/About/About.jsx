import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import Hero from "./Hero";
import Stats from "./Stats";
import Intro from "./Intro";
import Problems from "./Problems";
import Features from "./Features";
import Partners from "./Partners";
import CTA from "./CTA";
import { partners } from "./data";

const About = () => {
  const [showAllPartners, setShowAllPartners] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast.success("Discover amazing local restaurants!", {
        icon: "🏪",
        style: {
          background: "#3B82F6",
          color: "white",
        },
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const displayedPartners = showAllPartners ? partners : partners.slice(0, 4);

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.4 } },
    hover: {
      scale: 1.05,
      y: -5,
      transition: { duration: 0.2 },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-blue-600 font-semibold">
            Loading restaurant partners...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <Hero />
      <Stats />
      <Intro />
      <Problems />
      <Features
        activeFeature={activeFeature}
        setActiveFeature={setActiveFeature}
        cardVariants={cardVariants}
      />
      <Partners
        displayedPartners={displayedPartners}
        showAllPartners={showAllPartners}
        setShowAllPartners={setShowAllPartners}
        containerVariants={containerVariants}
        cardVariants={cardVariants}
      />
      <CTA />
    </div>
  );
};

export default About;
