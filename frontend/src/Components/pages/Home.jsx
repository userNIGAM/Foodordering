import React from "react";
import HeroSection from "./HeroSection";
import ProductsGrid from "../pages/products/ProductsGrid";
import ServicesSection from "../pages/services/ServicesSection";
import ContactSection from "../contact/ContactSection";
import Chatbot from "../pages/chat/Chatbot";
import AnimatedSection from "../AnimatedSection";
import Footer from "../footer/Footer";

const Home = () => {
  return (
    <>
      <HeroSection />
      <AnimatedSection
        variant={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
      >
        {/* <ProductsGrid />
      </AnimatedSection>
      <AnimatedSection
        variant={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
      > */}
        {/* <ServicesSection />
      </AnimatedSection>
      <AnimatedSection
        variant={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
      >
        <ContactSection /> */}
      </AnimatedSection>
      <Chatbot /> {/* Add chatbot here */}
      <AnimatedSection
        variant={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
      >
        <Footer />
      </AnimatedSection>
    </>
  );
};

export default Home;
