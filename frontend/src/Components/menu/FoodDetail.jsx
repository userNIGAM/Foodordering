// src/Components/menu/FoodDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  Truck,
  Shield,
  Clock,
  Heart,
  Plus,
  Minus,
  ShoppingCart,
} from "lucide-react";
import api from "../../services/api";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";

export default function FoodDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const { toggleWishlist, isInWishlist } = useWishlist();

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // helper to make images array (backend stores `image` string; some clients may store `images`)
  const getImages = (menuItem) => {
    if (!menuItem) return [];
    if (Array.isArray(menuItem.images) && menuItem.images.length > 0) {
      return menuItem.images;
    }
    if (typeof menuItem.image === "string" && menuItem.image.trim() !== "") {
      return [menuItem.image];
    }
    return []; // empty — UI will handle fallback
  };

  useEffect(() => {
    let cancelled = false;

    const fetchItemAndRelated = async () => {
      setLoading(true);
      setError(null);

      try {
        // fetch the single menu item from backend
        const res = await api.get(`/api/menu-items/${encodeURIComponent(id)}`);
        const fetchedItem = res?.data?.data;

        if (!fetchedItem) {
          throw new Error("Menu item not found");
        }

        if (cancelled) return;

        setItem(fetchedItem);
        setSelectedImage(0);

        // fetch related items by category (exclude current item)
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
            if (!cancelled) {
              setRelatedItems(relData.slice(0, 6));
            }
          } catch (relErr) {
            // non-fatal — just log and continue
            console.error("Failed to load related items:", relErr);
            if (!cancelled) setRelatedItems([]);
          }
        } else {
          setRelatedItems([]);
        }
      } catch (err) {
        console.error("Error loading menu item:", err);
        if (!cancelled) {
          setError(
            err?.response?.data?.message || err.message || "Failed to load item"
          );
          setItem(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchItemAndRelated();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-semibold mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link
          to="/menu"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Back to Menu
        </Link>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Menu item not found.</div>
      </div>
    );
  }

  const images = getImages(item);
  const displayImage = images[selectedImage] || "/placeholder-food.jpg";

  // map backend field names to what the UI expects
  const preparationTime = item.prepTime || item.preparationTime || "N/A";
  const calories = item.calories ?? null;
  const ingredients = Array.isArray(item.ingredients) ? item.ingredients : [];
  const reviews = Array.isArray(item.reviews) ? item.reviews : [];

  const handleAddToCart = () => {
    addToCart({ ...item, quantity }); // 👈 add item with selected quantity
  };

  const capitalize = (s) =>
    typeof s === "string" && s.length > 0
      ? s.charAt(0).toUpperCase() + s.slice(1)
      : s;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-indigo-600">
              Gourmet<span className="text-gray-800">Delights</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm text-gray-500">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="hover:text-indigo-600">
                Home
              </Link>
            </li>
            <li className="before:content-['/'] before:mx-2">
              <Link to="/menu" className="hover:text-indigo-600">
                Menu
              </Link>
            </li>
            <li className="before:content-['/'] before:mx-2 text-gray-800 truncate">
              {item.name}
            </li>
          </ol>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 mb-16">
          {/* Images */}
          <div>
            <div className="relative rounded-2xl overflow-hidden shadow-md mb-4">
              <img
                src={displayImage}
                alt={item.name}
                className="w-full h-80 object-cover"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (isInWishlist(item._id)) {
                    removeFromWishlist(item._id);
                  } else {
                    addToWishlist(item);
                  }
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
            </div>

            <div className="flex gap-2">
              {images.length > 0 ? (
                images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-indigo-600"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${item.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))
              ) : (
                <div className="w-full text-center text-gray-500 py-6">
                  No images available
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {item.name}
            </h1>

            <div className="flex items-center mb-4">
              <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mr-3">
                <Star size={16} className="fill-current mr-1" />
                <span className="font-semibold">
                  {(item.rating ?? 0).toFixed(1)}
                </span>
              </div>
              <span className="text-gray-600">•</span>
              <div className="flex items-center ml-3 text-gray-600">
                <Clock size={16} className="mr-1" />
                <span>{preparationTime}</span>
              </div>
            </div>

            <p className="text-2xl font-bold text-indigo-600 mb-6">
              ${Number(item.price ?? 0).toFixed(2)}
            </p>

            <div className="mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === "description"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  Description
                </button>
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === "ingredients"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("ingredients")}
                >
                  Ingredients
                </button>
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === "nutrition"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("nutrition")}
                >
                  Nutrition
                </button>
              </div>

              <div className="py-4">
                {activeTab === "description" && (
                  <p className="text-gray-700">{item.description}</p>
                )}

                {activeTab === "ingredients" && (
                  <ul className="list-disc list-inside text-gray-700">
                    {ingredients.length > 0 ? (
                      ingredients.map((ing, i) => <li key={i}>{ing}</li>)
                    ) : (
                      <li>No ingredients listed</li>
                    )}
                  </ul>
                )}

                {activeTab === "nutrition" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Calories</p>
                      <p className="font-semibold">
                        {calories !== null ? calories : "N/A"}
                      </p>
                    </div>

                    {/* If you later add protein/carbs/fat to schema you can render here */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="font-semibold">
                        {capitalize(item.category)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center mb-6">
              <span className="mr-4 font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-gray-600 hover:bg-gray-100"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 text-gray-600 hover:bg-gray-100"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center mb-6"
            >
              <ShoppingCart size={20} className="mr-2" />
              Add to Cart - ${(Number(item.price ?? 0) * quantity).toFixed(2)}
            </button>

            {/* Benefits */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Why order with us?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3 text-indigo-600">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Free Delivery</p>
                    <p className="text-sm text-gray-600">On orders over $25</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3 text-indigo-600">
                    <Shield size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Quality Guaranteed
                    </p>
                    <p className="text-sm text-gray-600">
                      Fresh ingredients daily
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3 text-indigo-600">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Ready in {preparationTime}
                    </p>
                    <p className="text-sm text-gray-600">Hot and fresh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

          {reviews.length === 0 ? (
            <div className="bg-white p-6 rounded-xl text-gray-600">
              No reviews yet — be the first to review this item.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((review, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                      <span className="font-semibold text-gray-600">
                        {String(review.user || "U").charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">
                        {review.user || "Anonymous"}
                      </p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, idx) => (
                          <Star
                            key={idx}
                            size={14}
                            className={
                              idx < Math.floor(review.rating ?? 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                        <span className="ml-2 text-gray-600">
                          {review.rating ?? "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">"{review.comment || ""}"</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Related */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">You may also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedItems.length === 0 ? (
              <div className="text-gray-500">No related items found.</div>
            ) : (
              relatedItems.map((related) => (
                <div
                  key={related._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={related.image || "/placeholder-food.jpg"}
                      alt={related.name}
                      className="w-full h-48 object-cover"
                    />
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors">
                      <Heart
                        size={16}
                        className="text-gray-600 hover:text-red-500"
                      />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">
                      {related.name}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          <Star size={14} className="fill-current mr-1" />
                          <span className="text-sm font-semibold">
                            {(related.rating ?? 0).toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <span className="text-indigo-600 font-bold text-lg">
                        ${Number(related.price ?? 0).toFixed(2)}
                      </span>
                    </div>
                    <Link
                      to={`/menu/${related._id}`}
                      className="w-full block text-center bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
