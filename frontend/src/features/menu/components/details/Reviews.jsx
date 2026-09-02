import React from "react";
import { Star } from "lucide-react";

export default function Reviews({ reviews }) {
  return (
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
                  <p className="font-medium">{review.user || "Anonymous"}</p>
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
  );
}
