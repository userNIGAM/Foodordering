import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";

const FloatingCartButton = ({ cartItems, onClick }) => {
  const [position, setPosition] = useState({ top: 100, left: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [addedItem, setAddedItem] = useState(false);

  // Pulse animation when items change
  useEffect(() => {
    if (cartItems.length > 0) {
      setAddedItem(true);
      const timer = setTimeout(() => setAddedItem(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartItems]);

  // Drag start
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      top: e.clientY - 25, // half button height
      left: e.clientX - 50, // half button width
    });
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);

    // Check if it was a click (movement < 5px)
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;
    if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
      onClick(); // open cart only if it was a click
    }
  };

  // Touch support
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setStartPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition({
      top: touch.clientY - 25,
      left: touch.clientX - 50,
    });
  };

  const handleTouchEnd = (e) => {
    if (!isDragging) return;
    setIsDragging(false);

    const touch = e.changedTouches[0];
    const dx = touch.clientX - startPos.x;
    const dy = touch.clientY - startPos.y;
    if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
      onClick();
    }
  };

  return (
    <div
      style={{ top: position.top, left: position.left }}
      className="fixed z-[999] cursor-pointer select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-2xl shadow-lg hover:bg-green-700 transition-all duration-300
          ${addedItem ? "animate-pulse" : ""}`}
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="font-semibold">Cart</span>
        {cartItems.length > 0 && (
          <span className="ml-1 bg-white text-green-700 font-bold text-sm px-2 py-0.5 rounded-full shadow">
            {cartItems.reduce((a, b) => a + b.quantity, 0)}
          </span>
        )}
      </button>
    </div>
  );
};

export default FloatingCartButton;
