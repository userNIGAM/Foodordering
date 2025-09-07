// ServicesSection.jsx
import { useState, useEffect } from "react";
import ServiceCard from "./ServiceCard";
import ValuesCard from "./ValuesCard";
import ServicesHeader from "./ServicesHeader";
import ServicesCTA from "./ServicesCTA";
import { servicesData, valuesData } from "./data";
import useScrollAnimationsList from "../../hooks/useScrollAnimation";
import Testimonials from "./Testimonials";
import FAQSection from "./FAQSection";
import StatsCounter from "./StatsCounter";
import FeaturedRestaurants from "./FeaturedRestaurants"; // ✅ New Component
import HowItWorks from "./HowItWorks"; // ✅ New Component

const ServicesSection = () => {
  const [activeService, setActiveService] = useState(0);

  // Animate Service cards
  const [serviceRefs, visibleServices] = useScrollAnimationsList(
    servicesData.length
  );

  // Animate Value cards
  const [valueRefs, visibleValues] = useScrollAnimationsList(valuesData.length);

  // Cycle through services every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % servicesData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="services"
      className="py-16 my-10 px-4 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <ServicesHeader />

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {servicesData.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => (serviceRefs.current[index] = el)}
              className={`transition-all duration-700 transform ${
                visibleServices.includes(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{
                transitionDelay: visibleServices.includes(index)
                  ? `${(index % 3) * 100}ms`
                  : "0ms",
              }}
            >
              <ServiceCard
                service={service}
                index={index}
                isVisible={visibleServices.includes(index)}
                onMouseEnter={() => setActiveService(index)}
              />
            </div>
          ))}
        </div>

        {/* How it Works */}
        <HowItWorks />

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {valuesData.map((value, index) => (
            <div
              key={value.id ?? index}
              ref={(el) => (valueRefs.current[index] = el)}
            >
              <ValuesCard
                value={value}
                isVisible={visibleValues.includes(index)}
              />
            </div>
          ))}
        </div>

        {/* Featured Restaurants */}
        <FeaturedRestaurants />

        {/* Stats */}
        <StatsCounter />

        {/* Testimonials */}
        <Testimonials />

        {/* FAQ Section */}
        <FAQSection />

        {/* CTA */}
        <ServicesCTA />
      </div>
    </section>
  );
};

export default ServicesSection;
