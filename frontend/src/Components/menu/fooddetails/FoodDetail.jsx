import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import { useCart } from "../../../contexts/CartContext";
import { useWishlist } from "../../../contexts/WishlistContext";
import Breadcrumb from "./Breadcrumb";
import FoodImages from "./FoodImages";
import FoodInfo from "./FoodInfo";
import QuantitySelector from "./QuantitySelector";
import AddToCartButton from "./AddToCartButton";
import Benefits from "./Benefits";
import Reviews from "./Reviews";
import RelatedItems from "./RelatedItems";
import StarRating from "../../UI/StarRating"; // ✅ Import star rating
import { useRating } from "../../hooks/useRating"; // ✅ Import hook
import StarRatingdynamic from "../../UI/StarRatingdynamic";

export default function FoodDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { rating, setRating, stats, submitRating } = useRating(id); // ✅ Hook for this item

  // fetch item + related
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/menu-items/${encodeURIComponent(id)}`);
        const fetchedItem = res?.data?.data;
        if (!fetchedItem) throw new Error("Menu item not found");

        if (!cancelled) {
          setItem(fetchedItem);
          setSelectedImage(0);
        }

        if (fetchedItem.category) {
          try {
            const relRes = await api.get(
              `/api/menu-items?category=${encodeURIComponent(
                fetchedItem.category
              )}&limit=6`
            );
            const relData = Array.isArray(relRes?.data?.data)
              ? relRes.data.data.filter((it) => it._id !== fetchedItem._id)
              : [];
            if (!cancelled) setRelatedItems(relData.slice(0, 6));
          } catch (relErr) {
            console.error("Failed to load related items:", relErr);
            if (!cancelled) setRelatedItems([]);
          }
        }
      } catch (err) {
        console.error("Error loading menu item:", err);
        if (!cancelled) {
          setError(err?.response?.data?.message || err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-semibold mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error}</p>
      </div>
    );

  if (!item)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Menu item not found.</div>
      </div>
    );

  const images =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : item.image
      ? [item.image]
      : [];
  const displayImage = images[selectedImage] || "/placeholder-food.jpg";

  return (
    <div className="min-h-screen bg-gray-50 py-17">
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb itemName={item.name} />

        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <FoodImages
            item={item}
            images={images}
            displayImage={displayImage}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            isInWishlist={isInWishlist}
            addToWishlist={addToWishlist}
            removeFromWishlist={removeFromWishlist}
          />

          <div>
            <FoodInfo
              item={item}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {/* ✅ Ratings Section (always visible) */}
            <div className="flex items-center mb-4">
              {/* Numeric average */}
              <span className="text-lg font-semibold mr-2">
                {stats?.average?.toFixed(1) || "0.0"}
              </span>

              {/* Star display (non-interactive) */}
              <StarRatingdynamic
                rating={stats?.average || 0}
                interactive={false}
              />

              {/* Review count */}
              <span className="text-sm text-gray-500 ml-2">
                ({stats?.count || 0} reviews)
              </span>
            </div>

            {/* ✅ User Rating (interactive for logged-in user) */}
            {rating !== null && (
              <div className="mb-6">
                <h4 className="font-medium mb-2">Your Rating</h4>
                <StarRating
                  rating={rating}
                  onSubmit={submitRating}
                  interactive
                />
              </div>
            )}

            <QuantitySelector quantity={quantity} setQuantity={setQuantity} />

            <AddToCartButton
              item={item}
              quantity={quantity}
              addToCart={addToCart}
            />

            <Benefits preparationTime={item.prepTime || item.preparationTime} />
          </div>
        </div>

        <Reviews reviews={item.reviews || []} />
        <RelatedItems relatedItems={relatedItems} />
      </main>
    </div>
  );
}
