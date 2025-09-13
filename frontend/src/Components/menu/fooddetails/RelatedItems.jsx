import React from "react";
import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import Image from "../../UI/Image";

export default function RelatedItems({ relatedItems }) {
  return (
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
                <Image
                  src={related.image}
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
                <h3 className="font-semibold text-lg mb-2">{related.name}</h3>
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
  );
}
