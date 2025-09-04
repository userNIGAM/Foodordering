import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  // Send,
  // ChefHat,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
} from "lucide-react";
import ContactForm from "./ContactForm";

const ContactSection = () => {
  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   subject: "",
  //   message: "",
  // });

  // const handleChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Handle form submission here
  //   console.log("Form submitted:", formData);
  //   alert("Thank you for your message! We will get back to you soon.");
  //   setFormData({ name: "", email: "", subject: "", message: "" });
  // };

  // Social media data
  const socialMedia = [
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://facebook.com/nigamsubedi.18",
      color: "hover:bg-blue-100 hover:text-blue-600",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/nigamsubedi3/",
      color: "hover:bg-pink-100 hover:text-pink-600",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: "#",
      color: "hover:bg-blue-100 hover:text-blue-400",
    },
    {
      name: "YouTube",
      icon: Youtube,
      url: "https://youtube.com/@developer102",
      color: "hover:bg-red-100 hover:text-red-600",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/in/nigam-subedi-8b65a8323/",
      color: "hover:bg-blue-100 hover:text-blue-700",
    },
  ];

  return (
    <section
      className="py-16 bg-gradient-to-br from-amber-50 to-orange-50"
      id="contact"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-orange-800 mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-orange-600 max-w-2xl mx-auto">
            Have questions about our food delivery service? We're here to help
            and would love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 h-fit">
            <h3 className="text-2xl font-semibold text-orange-900 mb-6">
              Contact Information
            </h3>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-orange-100 p-3 rounded-full mr-4">
                  <Phone className="text-orange-600" size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Phone Number</h4>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-gray-600">+1 (555) 987-FOOD</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-orange-100 p-3 rounded-full mr-4">
                  <Mail className="text-orange-600" size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Email Address</h4>
                  <p className="text-gray-600">support@foodexpress.com</p>
                  <p className="text-gray-600">orders@foodexpress.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-orange-100 p-3 rounded-full mr-4">
                  <MapPin className="text-orange-600" size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Main Office</h4>
                  <p className="text-gray-600">123 Culinary Street</p>
                  <p className="text-gray-600">Foodville, Tasty 54321</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-orange-100 p-3 rounded-full mr-4">
                  <Clock className="text-orange-600" size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Working Hours</h4>
                  <p className="text-gray-600">Mon-Fri: 9:00 AM - 10:00 PM</p>
                  <p className="text-gray-600">Weekends: 10:00 AM - 11:00 PM</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="font-medium text-gray-800 mb-4">Follow Us</h4>
              <div className="flex space-x-3">
                {socialMedia.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      className={`bg-orange-100 text-orange-600 p-3 rounded-full cursor-pointer transition-all duration-300 ${social.color}`}
                      aria-label={social.name}
                    >
                      <IconComponent size={18} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <ContactForm isVisible={true} />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
