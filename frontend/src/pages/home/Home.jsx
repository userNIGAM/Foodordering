import React from "react";
import HeroSection from "../../Components/pages/HeroSection";
import ProductsGrid from "../../Components/pages/products/ProductsGrid";
import ServicesSection from "../../Components/pages/services/ServicesSection";
import ContactSection from "../contact/Contact";
import Chatbot from "../../Components/pages/chat/Chatbot";
import AnimatedSection from "../../Components/AnimatedSection";
import Footer from "../../Components/layout/Footer";
import HomeFoodSection from "../../Components/pages/HeroMenu";

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
        <HomeFoodSection />
        {/* <ContactSection /> */}
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
