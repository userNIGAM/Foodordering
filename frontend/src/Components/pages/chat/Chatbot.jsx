import React, { useState, useRef, useEffect, useContext } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { generateBotResponse } from "./conversationService";
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Load chat history from localStorage if user is authenticated
    if (user) {
      const savedChat = localStorage.getItem(`chat_${user.id}`);
      if (savedChat) {
        setMessages(JSON.parse(savedChat));
      } else {
        // Add welcome message if no history exists
        setMessages([
          {
            id: Date.now(),
            text: "Hello! I'm your ORDER assistant. How can I help you today?",
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      }
    }
  }, [user]);

  useEffect(() => {
    // Save messages to localStorage when they change
    if (user && messages.length > 0) {
      localStorage.setItem(`chat_${user.id}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  useEffect(() => {
    // Scroll to bottom when new message is added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponseText = generateBotResponse(inputMessage);
      const botResponse = {
        id: Date.now() + 1,
        text: botResponseText,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500); // Increased delay to show typing animation longer
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Animation variants
  const chatContainerVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    tap: { scale: 0.9 },
    hover: { scale: 1.1 },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <>
      {/* Chatbot toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors z-30"
        aria-label="Open chat"
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat container with animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-6 w-80 h-96 bg-gray-300 rounded-lg shadow-xl z-50 flex flex-col border border-gray-200"
            variants={chatContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="bg-green-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <h3 className="font-semibold">ORDER Assistant</h3>
              <motion.button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="hover:bg-green-700 p-1 rounded"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 p-4 overflow-y-auto space-y-3"
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-green-100 text-green-900"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-50 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                    <div className="flex items-center space-x-1">
                      <Bot size={14} />
                      <div className="flex space-x-1">
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.6,
                            delay: 0,
                          }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.6,
                            delay: 0.2,
                          }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.6,
                            delay: 0.4,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input area */}
            <div className="p-3 flex items-center">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={!user || isTyping}
              />
              <motion.button
                onClick={handleSendMessage}
                disabled={!user || inputMessage.trim() === "" || isTyping}
                className="bg-green-600 text-white p-2 rounded-r-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send size={18} />
              </motion.button>
            </div>

            {!user && (
              <div className="p-3 bg-yellow-50 text-yellow-800 text-sm text-center">
                Please log in to chat with our assistant
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
