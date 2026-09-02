import React from "react";

const NewsletterSection = () => (
  <section className="py-16 bg-[#88A096] text-white rounded-xl mt-16 text-center">
    <h2 className="text-3xl font-serif font-bold mb-4">Get Exclusive Deals</h2>
    <p className="max-w-2xl mx-auto mb-8 px-4">
      Subscribe to our newsletter and receive exclusive discounts and offers
      every week.
    </p>

    <div className="flex flex-col md:flex-row justify-center gap-4 max-w-2xl mx-auto px-4">
      <input
        type="email"
        placeholder="Your email address"
        className="flex-grow px-5 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2635] text-gray-800"
      />
      <button className="bg-[#8B2635] px-6 py-3 rounded-lg font-medium hover:bg-[#2E3532] transition">
        Subscribe
      </button>
    </div>
  </section>
);

export default NewsletterSection;
