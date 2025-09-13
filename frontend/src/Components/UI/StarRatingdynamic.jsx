// components/UI/StarRating.jsx
import React from "react";
import { Star } from "lucide-react";

export default function StarRatingdynamic({
  rating = 0,
  interactive = false,
  onSubmit,
}) {
  const stars = [];

  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <Star
          key={i}
          size={20}
          fill="currentColor"
          className="text-yellow-500"
        />
      );
    } else if (i === fullStars + 1 && hasHalf) {
      stars.push(
        <Star key={i} size={20} className="text-yellow-500">
          <div className="w-1/2 h-full bg-yellow-500"></div>
        </Star>
      );
    } else {
      stars.push(<Star key={i} size={20} className="text-gray-300" />);
    }
  }

  return <div className="flex items-center">{stars}</div>;
}
