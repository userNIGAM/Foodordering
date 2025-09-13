import { useState } from "react";
import { Star } from "lucide-react";

export default function StarRating({ rating: initialRating = 0, onSubmit }) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const handleClick = async (value) => {
    setRating(value);
    setExpanded(false);
    if (onSubmit) {
      await onSubmit(value); // send to backend
    }
  };

  return (
    <div
      className="flex space-x-1 cursor-pointer"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {expanded ? (
        [1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
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
        <Star
          size={18}
          className={`transition-colors ${
            rating > 0 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
          }`}
        />
      )}
    </div>
  );
}
