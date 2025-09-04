import React, { useState } from "react";
import { Send, ChefHat, Loader2, CheckCircle } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";
import ChefTip from "./ChefTip";

const ContactForm = ({ isVisible }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const { data } = await api.post("/api/contact", formData);
      toast.success(data.message || "Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });

      // ✅ Show success state in button
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 2000); // reset after 2s
    } catch (err) {
      console.error("Something went wrong:", err);
      toast.error("Could not send your message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-semibold text-orange-900 mb-6">
          Send us a Message
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="How can we help you?"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="Please describe your inquiry in detail..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center transition-all
              ${
                success
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
              }
              ${loading ? "opacity-75 cursor-not-allowed" : ""}
            `}
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : success ? (
              <CheckCircle className="mr-2 h-5 w-5" />
            ) : (
              <Send className="mr-2 h-5 w-5 transition-transform duration-300 hover:scale-110" />
            )}
            {loading ? "Sending..." : success ? "Sent!" : "Send Message"}
          </button>
        </form>

        <ChefTip isVisible={isVisible} />
      </div>
    </div>
  );
};

export default ContactForm;
