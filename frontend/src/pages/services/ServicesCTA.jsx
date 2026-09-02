import { useNavigate } from "react-router-dom";

const ServicesCTA = () => {
  const navigate = useNavigate();
  return (
    <div className="text-center mt-16">
      <h3 className="text-3xl font-bold text-gray-900 mb-6">
        Ready to experience better food delivery?
      </h3>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={() => {
            navigate("/menu");
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-xl transition-colors"
        >
          Order Now
        </button>
        <button
          onClick={() => {
            navigate("/");
          }}
          className="border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-8 rounded-xl transition-colors"
        >
          Explore Restaurants
        </button>
      </div>
      <p className="text-gray-500 mt-6">
        Join 250,000+ satisfied customers who choose TastyLocal
      </p>
    </div>
  );
};

export default ServicesCTA;
