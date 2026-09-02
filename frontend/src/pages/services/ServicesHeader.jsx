import AnimatedSection from "../../AnimatedSection";
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
// ServicesHeader.jsx
const ServicesHeader = () => {
  return (
    <div className="text-center mb-16 py-3">
      <AnimatedSection variant={headingVariant}>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Why Choose <span className="text-orange-600">Order</span>?
        </h2>
      </AnimatedSection>
      <AnimatedSection variant={textVariant}>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're not just a food delivery service - we're your partner in
          enjoying great local food with convenience and care.
        </p>
      </AnimatedSection>
    </div>
  );
};

export default ServicesHeader;
