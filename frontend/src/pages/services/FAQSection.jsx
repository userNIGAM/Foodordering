// FAQSection.jsx
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQSection = () => {
  const faqs = [
    {
      q: "How fast is delivery?",
      a: "Most orders arrive within 30 minutes, thanks to our optimized routes.",
    },
    {
      q: "Do you offer vegetarian and vegan options?",
      a: "Yes, we have over 15 dietary categories including vegan, gluten-free, and keto.",
    },
    {
      q: "What if I'm not satisfied with my order?",
      a: "We offer a full satisfaction guarantee — if you’re unhappy, we’ll make it right.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="mt-20">
      <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
        Frequently Asked Questions
      </h3>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-lg shadow cursor-pointer"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-900">{faq.q}</h4>
              <ChevronDown
                className={`transition-transform ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </div>
            {openIndex === i && <p className="mt-3 text-gray-600">{faq.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
