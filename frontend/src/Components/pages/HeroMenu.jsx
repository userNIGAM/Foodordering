// src/Components/pages/home/HomeFoodSection.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, StarHalf, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import api from "../../services/api";
import Image from "../UI/Image";
import useScrollAnimationsList from "../hooks/useScrollAnimation";
import useInView from "../hook/useInView";
import AnimatedSection from "../AnimatedSection";

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

export default function HomeFoodSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [itemRefs, visibleItems] = useScrollAnimationsList(items.length);
  const [showMoreRef, showMoreVisible] = useInView(0.1);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("/api/menu-items?limit=24");
        setItems(res?.data?.data || []);
      } catch (err) {
        console.error("Failed to load home items:", err);
        setError("Unable to load items right now.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star
            key={i}
            size={14}
            fill="currentColor"
            className="text-yellow-500"
          />
        );
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <StarHalf
            key={i}
            size={14}
            fill="currentColor"
            className="text-yellow-500"
          />
        );
      } else {
        stars.push(<Star key={i} size={14} className="text-gray-300" />);
      }
    }
    return stars;
  };

  if (loading)
    return (
      <div className="text-center py-20">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-gray-600">
        <p>{error}</p>
      </div>
    );

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <motion.h2
          className="text-3xl font-bold text-gray-900 mb-2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <AnimatedSection variant={headingVariant}>
            Our Popular Dishes
          </AnimatedSection>
        </motion.h2>
        <motion.p
          className="text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <AnimatedSection variant={textVariant}>
            A few of our delicious options, just for you!
          </AnimatedSection>
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-6 lg:px-8">
        {items.map((item, i) => {
          const isVisible = visibleItems.includes(i);
          return (
            <motion.div
              key={item._id}
              ref={(el) => (itemRefs.current[i] = el)}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={
                isVisible
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0.8, y: 40, scale: 0.95 }
              }
              transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <Link to={`/menu/${item._id}`} className="block relative">
                <Image
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (isInWishlist(item._id)) removeFromWishlist(item._id);
                    else addToWishlist(item);
                  }}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md"
                >
                  <Heart
                    size={16}
                    className={
                      isInWishlist(item._id) ? "text-red-500" : "text-gray-600"
                    }
                  />
                </button>
              </Link>

              <div className="p-4 text-left">
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    {renderStars(item.ratings?.average || 0)}
                    <span className="ml-1 text-sm text-gray-500">
                      {item.ratings?.average?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                  <span className="text-indigo-600 font-bold text-lg">
                    ${Number(item.price).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(item);
                  }}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        ref={showMoreRef}
        // initial={{ opacity: 0, y: 50 }}
        animate={showMoreVisible ? { opacity: 1, y: 0 } : {}}
        // style={{
        //   background: "rgba(255,0,0,0.2)",
        //   zIndex: 50,
        //   position: "relative",
        // }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mt-12"
      >
        <Link
          to="/menu"
          className="inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
        >
          Show More
        </Link>
      </motion.div>
    </section>
  );
}
