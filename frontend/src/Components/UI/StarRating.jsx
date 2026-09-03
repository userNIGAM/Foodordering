import { Star } from "lucide-react";

export default function StarRating({
  rating = 0,
  interactive = false,
  onSubmit,
  size = 20,
}) {
  const [currentRating, setCurrentRating] = useState(rating);
  const [hover, setHover] = useState(null);

  const displayRating = hover ?? currentRating;

  const handleClick = async (value) => {
    if (!interactive) return;

    setCurrentRating(value);

    if (onSubmit) {
      await onSubmit(value);
    }
  };

  const fullStars = Math.floor(displayRating);
  const hasHalfStar = displayRating - fullStars >= 0.5;

  return (
    <div
      className={`flex items-center gap-1 ${
        interactive ? "cursor-pointer" : ""
      }`}
      onMouseLeave={() => interactive && setHover(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFull = star <= fullStars;
        const isHalf = star === fullStars + 1 && hasHalfStar;

        return (
          <div
            key={star}
            className="relative"
            onMouseEnter={() => interactive && setHover(star)}
            onClick={() => interactive && handleClick(star)}
          >
            {/* Background / Empty Star */}
            <Star size={size} className="text-gray-300" />

            {/* Filled Star */}
            {(isFull || isHalf) && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  width: isHalf ? "50%" : "100%",
                }}
              >
                <Star
                  size={size}
                  fill="currentColor"
                  className="text-yellow-500"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
