/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { FaUtensils, FaShippingFast, FaHeadset, FaAward } from "react-icons/fa";
import ServiceCard from "./ServiceCard";

const ServicesHighlight = () => {
  const [visibleServices, setVisibleServices] = useState([]);
  const servicesRef = useRef(null);

  const servicesData = [
    { icon: <FaUtensils className="text-2xl" />, title: "Wide Variety", description: "Choose from hundreds of restaurants and cuisines" },
    { icon: <FaShippingFast className="text-2xl" />, title: "Fast Delivery", description: "Get your food delivered in 30 minutes or less" },
    { icon: <FaHeadset className="text-2xl" />, title: "24/7 Support", description: "Our team is always ready to help you" },
    { icon: <FaAward className="text-2xl" />, title: "Quality Guaranteed", description: "Only the best restaurants partner with us" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            servicesData.forEach((_, index) => {
              setTimeout(
                () => setVisibleServices(prev => [...prev, index]),
                index * 100
              );
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (servicesRef.current) observer.observe(servicesRef.current);
    return () => servicesRef.current && observer.unobserve(servicesRef.current);
  }, []);

  return (
    <div className="bg-gradient-to-r from-orange-500 to-pink-600 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Why Choose Order?</h2>

        <div ref={servicesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesData.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              isVisible={visibleServices.includes(index)}
              delay={(index % 4) * 100}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesHighlight;
