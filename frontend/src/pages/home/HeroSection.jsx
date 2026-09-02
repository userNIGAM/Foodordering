/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart, ChevronRight, Star, Clock, Shield, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedSection from "../AnimatedSection";

const headingVariant = {
  hidden: { y: -40, scale: 0.95, opacity: 0 },
  visible: {
    y: 0,
    scale: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const textVariant = {
  hidden: { y: 20, scale: 0.95, opacity: 0 },
  visible: {
    y: 0,
    scale: 1,
    opacity: 1,
    transition: { duration: 0.8, delay: 0.2, ease: "easeOut" },
  },
};

const badgeVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 * i, duration: 0.5, ease: "easeOut" },
  }),
};

const scrollIconVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const heroRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoaded(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollHint(entry.isIntersecting);
      },
      { threshold: 0.6 }
    );

    if (heroRef.current) observer.observe(heroRef.current);

    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
    };
  }, []);

  const scrollToContent = () => {
    const nextSection = document.getElementById("next-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="overflow-hidden snap-y snap-mandatory scroll-smooth"
      id="home"
    >
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative w-full bg-gradient-to-br from-slate-300 to-slate-400 text-slate-800 py-16 md:py-24 px-6 md:px-12 my-5 snap-start"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Left Content */}
          <div
            className={`flex-1 text-center md:text-left transition-all duration-700 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <AnimatedSection variant={badgeVariant}>
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full mb-6 text-sm font-medium">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>Trusted by 10,000+ customers</span>
              </div>
            </AnimatedSection>

            <AnimatedSection variant={headingVariant}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Savor Culinary <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-indigo-700">
                  Excellence
                </span>{" "}
                Delivered
              </h1>
            </AnimatedSection>

            <AnimatedSection variant={textVariant}>
              <p className="text-lg text-slate-600 mb-8 max-w-md leading-relaxed">
                Experience restaurant-quality meals crafted by top chefs and
                delivered to your doorstep. Simple, fast, and absolutely
                delicious.
              </p>
            </AnimatedSection>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={() => navigate("/menu")}
                className="group bg-gradient-to-r from-indigo-700 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto md:mx-0 hover:-translate-y-0.5"
              >
                <ShoppingCart className="w-5 h-5" />
                Order Now
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate("/menu")}
                className="border border-slate-300 bg-white text-slate-700 px-8 py-4 rounded-xl font-medium shadow-sm hover:shadow-md transition-all mx-auto md:mx-0"
              >
                View Menu
              </button>
            </div>

            <div className="flex flex-wrap gap-6 justify-center md:justify-start">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span className="text-sm">30-min delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                <span className="text-sm">Food safety ensured</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div
            className={`flex-1 flex justify-center transition-all duration-700 delay-150 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-indigo-500 rounded-2xl blur-lg opacity-20 transition"></div>
              <img
                src="/Project-images/Burger.jpeg"
                alt="Gourmet burger with fresh ingredients"
                className="relative w-full h-96 object-cover max-w-md rounded-2xl shadow-xl transform transition duration-700 hover:scale-105"
              />

              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-md py-3 px-4 flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">4.9/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        {showScrollHint && (
          <motion.div
            className="absolute left-1/2 bottom-6 -translate-x-1/2 z-20"
            variants={scrollIconVariant}
            initial="hidden"
            animate="visible"
          >
            <button
              onClick={scrollToContent}
              className="flex flex-col items-center text-slate-700 hover:text-indigo-700 transition"
              aria-label="Scroll down"
            >
              <span className="text-xs mb-1 font-medium">Scroll</span>
              <ChevronDown className="w-7 h-7" />
            </button>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default HeroSection;