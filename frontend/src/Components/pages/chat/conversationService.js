// conversationService.js
export const generateBotResponse = (userMessage) => {
  const message = userMessage.toLowerCase();

  if (
    message.includes("hello") ||
    message.includes("hi") ||
    message.includes("hey")
  ) {
    return "Hello! Welcome to our Order service. How can I assist you with your grocery needs today?";
  } else if (
    message.includes("menu") ||
    message.includes("food") ||
    message.includes("items")
  ) {
    return "We offer a wide variety of food items including fresh produce, dairy, baked goods, and packaged foods. You can browse our complete menu in the 'Menu' section. Is there something specific you're looking for?";
  } else if (
    message.includes("order") ||
    message.includes("purchase") ||
    message.includes("buy")
  ) {
    return "To place an order, simply browse our products, add items to your cart, and proceed to checkout. We offer secure payment options and delivery services. Need help with a specific order?";
  } else if (
    message.includes("delivery") ||
    message.includes("location") ||
    message.includes("area")
  ) {
    return "We currently serve the local area with delivery and pickup options. During checkout, you can choose your preferred delivery method and provide your address. Our delivery hours are 8 AM to 10 PM daily.";
  } else if (
    message.includes("contact") ||
    message.includes("phone") ||
    message.includes("number")
  ) {
    return "You can reach our customer service at (555) 123-ORDER during business hours (8 AM - 10 PM). For faster assistance, you can also use this chat or email us at support@order-service.com";
  } else if (
    message.includes("account") ||
    message.includes("login") ||
    message.includes("sign up")
  ) {
    return "To access all features, please create an account or log in. This allows you to save your order history, track deliveries, and manage your preferences. Click on the 'Login' button to get started!";
  } else if (
    message.includes("hours") ||
    message.includes("open") ||
    message.includes("time")
  ) {
    return "We're available 24/7 for online orders! Delivery and pickup times are from 8 AM to 10 PM daily. You can place orders anytime and schedule them for when you prefer.";
  } else if (
    message.includes("payment") ||
    message.includes("pay") ||
    message.includes("card")
  ) {
    return "We accept all major credit cards, debit cards, PayPal, and mobile payment options. All payments are processed securely. We also offer cash on delivery for local orders.";
  } else if (message.includes("thank") || message.includes("thanks")) {
    return "You're welcome! Is there anything else I can help you with regarding your order or our services?";
  } else if (message.includes("help") || message.includes("support")) {
    return "I'm here to help! I can assist with: order placement, menu questions, delivery information, account issues, payment methods, and general inquiries. What do you need help with?";
  } else if (
    message.includes("price") ||
    message.includes("cost") ||
    message.includes("expensive")
  ) {
    return "We offer competitive pricing on all our products. You can view prices for each item in our menu. We also have regular promotions and discounts for loyal customers!";
  } else if (
    message.includes("quality") ||
    message.includes("fresh") ||
    message.includes("organic")
  ) {
    return "We pride ourselves on offering high-quality, fresh products. Many of our items are locally sourced and organic. Quality assurance is our top priority!";
  } else if (
    message.includes("cancel") ||
    message.includes("return") ||
    message.includes("refund")
  ) {
    return "You can cancel orders within 30 minutes of placement. For returns and refunds, please contact our customer service team who will be happy to assist you.";
  } else {
    return "Thanks for your message! I'm here to help with your ORDER needs. You can ask me about our menu, delivery options, payment methods, or account questions. How can I assist you today?";
  }
};

// Optional: Pre-defined quick questions for users
export const quickQuestions = [
  "What's on the menu today?",
  "How does delivery work?",
  "What payment methods do you accept?",
  "How do I create an account?",
];
