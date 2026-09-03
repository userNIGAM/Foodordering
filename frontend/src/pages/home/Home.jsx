import React from "react";
import HeroSection from "./HeroSection";
import Chatbot from "../../features/chat/Chatbot";
import AnimatedSection from "../../components/common/AnimatedSection";
import Footer from "../../components/layout/Footer";
import HomeFoodSection from "./HeroMenu";

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
