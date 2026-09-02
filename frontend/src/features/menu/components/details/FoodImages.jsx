import React from "react";
import { Heart } from "lucide-react";
import Image from "../../UI/Image";

export default function FoodImages({
  item,
  images,
  displayImage,
  selectedImage,
  setSelectedImage,
  isInWishlist,
  addToWishlist,
  removeFromWishlist,
}) {
  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden shadow-md mb-4">
        <Image
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
              <Image
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
  );
}
