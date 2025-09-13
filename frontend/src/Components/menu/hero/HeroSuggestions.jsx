import PropTypes from "prop-types";
import Image from "../../UI/Image";

export default function HeroSuggestions({
  suggestions,
  safeSearch,
  handleSuggestionClick,
}) {
  if (safeSearch.trim() !== "" && suggestions.length === 0) {
    return (
      <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 px-6 py-4 text-gray-600">
        No items found matching "{safeSearch}"
      </div>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
      {suggestions.map((item) => (
        <button
          key={item._id}
          className="w-full px-6 py-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleSuggestionClick(item)}
        >
          <div className="flex items-center space-x-4">
            <Image
              src={item.image}
              alt={item.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{item.name}</div>
              <div className="text-sm text-gray-600 capitalize">
                {item.category}
              </div>
            </div>
            <div className="text-indigo-600 font-bold">
              ${item.price.toFixed(2)}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

HeroSuggestions.propTypes = {
  suggestions: PropTypes.array.isRequired,
  safeSearch: PropTypes.string.isRequired,
  handleSuggestionClick: PropTypes.func.isRequired,
};
