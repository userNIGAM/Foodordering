/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUtensils,
  FaShippingFast,
  FaHeadset,
  FaAward,
} from "react-icons/fa";
import { MessageCircle, Users } from "lucide-react";

const Footer = () => {
  const [visibleServices, setVisibleServices] = useState([]);
  const [activeService, setActiveService] = useState(0);
  const servicesRef = useRef(null);

  const servicesData = [
    {
      icon: <FaUtensils className="text-2xl" />,
      title: "Wide Variety",
      description: "Choose from hundreds of restaurants and cuisines",
    },
    {
      icon: <FaShippingFast className="text-2xl" />,
      title: "Fast Delivery",
      description: "Get your food delivered in 30 minutes or less",
    },
    {
      icon: <FaHeadset className="text-2xl" />,
      title: "24/7 Support",
      description: "Our team is always ready to help you",
    },
    {
      icon: <FaAward className="text-2xl" />,
      title: "Quality Guaranteed",
      description: "Only the best restaurants partner with us",
    },
  ];

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add indices to visibleServices with a delay
            servicesData.forEach((_, index) => {
              setTimeout(() => {
                setVisibleServices((prev) => [...prev, index]);
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (servicesRef.current) {
      observer.observe(servicesRef.current);
    }

    return () => {
      if (servicesRef.current) {
        observer.unobserve(servicesRef.current);
      }
    };
  }, []);

  // Cycle through services every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % servicesData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-gray-900 text-white">
      {/* Services Highlight Section */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-600 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Why Choose Order?
          </h2>

          <div
            ref={servicesRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {servicesData.map((service, index) => (
              <div
                key={index}
                className={`bg-white text-gray-900 rounded-xl p-6 shadow-lg transition-all duration-700 transform ${
                  visibleServices.includes(index)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: visibleServices.includes(index)
                    ? `${(index % 4) * 100}ms`
                    : "0ms",
                }}
              >
                <div className="flex justify-center mb-4 text-orange-500">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Food Concierge Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-gray-800 text-white rounded-2xl p-8 md:p-12 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h3 className="text-3xl font-bold mb-4">
                Personal Food Concierge
              </h3>
              <p className="text-gray-300 mb-6">
                Our unique service connects you with a food expert who can make
                recommendations based on your tastes, dietary needs, and even
                your mood!
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <span className="bg-orange-500 w-6 h-6 rounded-full flex items-center justify-center mr-3">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  </span>
                  Personalized meal recommendations
                </li>
                <li className="flex items-center">
                  <span className="bg-orange-500 w-6 h-6 rounded-full flex items-center justify-center mr-3">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  </span>
                  One-on-one chat support
                </li>
                <li className="flex items-center">
                  <span className="bg-orange-500 w-6 h-6 rounded-full flex items-center justify-center mr-3">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  </span>
                  Custom meal planning assistance
                </li>
              </ul>
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center">
                <MessageCircle size={20} className="mr-2" />
                Chat with our concierge
              </button>
            </div>
            <div className="md:w-1/2 relative">
              <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl p-6 transform rotate-2">
                <div className="bg-white text-gray-900 rounded-xl p-4 transform -rotate-2 shadow-lg">
                  <div className="flex items-start mb-4">
                    <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <Users size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        Your Personal Food Advisor
                      </h4>
                      <p className="text-sm text-gray-500">
                        Typically replies in 5 minutes
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 mb-3">
                    <p className="text-sm">
                      Hi there! Looking for something specific today or need
                      recommendations?
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-2 px-4 rounded-full transition-colors">
                      Quick suggestions
                    </button>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-2 px-4 rounded-full transition-colors">
                      Dietary needs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4 text-orange-500">Order</h3>
            <p className="text-gray-400 mb-6">
              Delivering delicious meals to your doorstep. Order from your
              favorite restaurants with just a few clicks.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/nigamsubedi.18"
                target="_blank"
                className="bg-gray-800 p-3 rounded-full hover:bg-orange-500 transition-colors"
              >
                <FaFacebookF size={16} />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-3 rounded-full hover:bg-orange-500 transition-colors"
              >
                <FaTwitter size={16} />
              </a>
              <a
                href="https://www.instagram.com/nigamsubedi3/"
                target="_blank"
                className="bg-gray-800 p-3 rounded-full hover:bg-orange-500 transition-colors"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="https://www.linkedin.com/in/nigam-subedi-8b65a8323/"
                target="_blank"
                className="bg-gray-800 p-3 rounded-full hover:bg-orange-500 transition-colors"
              >
                <FaLinkedinIn size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Restaurants
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">
              Categories
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Pizza
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Burgers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Sushi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Pasta
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Desserts
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-orange-500" />
                <span className="text-gray-400">
                  123 Food Street, Culinary District, Taste City
                </span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3 text-orange-500" />
                <span className="text-gray-400">+1 (234) 567-8901</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-orange-500" />
                <span className="text-gray-400">support@order.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h4 className="text-lg font-semibold mb-2">
                Subscribe to Our Newsletter
              </h4>
              <p className="text-gray-400">
                Get the latest updates and special offers
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-gray-800 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 w-full md:w-auto"
              />
              <button className="bg-orange-500 text-white font-medium px-6 py-3 rounded-r-lg hover:bg-orange-600 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-950 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Order. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-500 hover:text-orange-500 text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-orange-500 text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-orange-500 text-sm transition-colors"
              >
                Refund Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile App Badges */}
      <div className="bg-gray-900 py-6 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
            <p className="text-gray-400 mr-0 md:mr-4">
              Download our app for better experience
            </p>
            <div className="flex space-x-4">
              <button className="bg-gray-800 hover:bg-gray-700 transition-colors px-4 py-2 rounded-lg flex items-center">
                <span className="mr-2">📱</span>
                <span>
                  <div className="text-xs">Download on the</div>
                  <div className="font-semibold">App Store</div>
                </span>
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 transition-colors px-4 py-2 rounded-lg flex items-center">
                <span className="mr-2">🤖</span>
                <span>
                  <div className="text-xs">GET IT ON</div>
                  <div className="font-semibold">Google Play</div>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
