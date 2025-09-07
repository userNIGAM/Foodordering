// HowItWorks.jsx
import { ShoppingBag, CreditCard, Utensils } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <ShoppingBag className="text-orange-500" size={36} />,
      title: "Browse & Choose",
      text: "Explore restaurants, cuisines, or curated meal plans that suit your taste.",
    },
    {
      icon: <CreditCard className="text-orange-500" size={36} />,
      title: "Place Your Order",
      text: "Add meals to your cart, customize, and pay securely in a few clicks.",
    },
    {
      icon: <Utensils className="text-orange-500" size={36} />,
      title: "Enjoy Your Meal",
      text: "Your food arrives fresh and hot — ready to enjoy with family or friends.",
    },
  ];

  return (
    <div className="my-20">
      <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
        How It Works
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {steps.map((step, i) => (
          <div
            key={i}
            className="text-center bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <div className="w-16 h-16 flex items-center justify-center mx-auto rounded-full bg-orange-50 mb-6">
              {step.icon}
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              {step.title}
            </h4>
            <p className="text-gray-600">{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
