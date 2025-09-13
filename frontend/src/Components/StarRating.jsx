import { useState } from "react";
import { Star } from "lucide-react"; // you can swap with any star icon

const StarRating = ({ productId, onSubmit }) => {
  const [rating, setRating] = useState(0); // saved rating
  const [hover, setHover] = useState(null); // current hover
  const [expanded, setExpanded] = useState(false); // collapsed or expanded

  const handleClick = async (value) => {
    setRating(value);
    setExpanded(false); // collapse back after click (optional)
    if (onSubmit) {
      try {
        await onSubmit(value);
      } catch (err) {
        console.error("Failed to submit rating:", err);
      }
    }
  };

  return (
    <div
      className="flex space-x-1 cursor-pointer"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {expanded ? (
        // Show 5 interactive stars
        [1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={28}
            className={`transition-colors ${
              (hover || rating) >= star
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            }`}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
            onClick={() => handleClick(star)}
          />
        ))
      ) : (
        // Collapsed state → single star
        <Star
          size={28}
          className={`transition-colors ${
            rating > 0 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
          }`}
        />
      )}
    </div>
  );
};

export default StarRating;
